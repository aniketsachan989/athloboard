(function(window) {
  const DB_KEY = 'ATHLOBOARD_MASTER_DB_V2';

  // Supabase client initialization
  const supabaseUrl = 'https://xonuqhgxiswmwllqnpdx.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvbnVxaGd4aXN3bXdsbHFucGR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ3NzIwMDAsImV4cCI6MjA0MDM0ODAwMH0.supabase_public_anon_token_athloboard';
  const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

  const INITIAL_DB = {
    athletes: [], gyms: [], vendors: [], brands: [], products: [], lifts: [], competitions: [], reviewReports: [], currentSession: null, emailDispatches: []
  };

  class AthloboardDB {
    constructor() {
      this.init();
    }

    async init() {
      if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DB));
      }
      if (supabase) {
        await this.syncFromSupabase();
      }
    }

    async syncFromSupabase() {
      try {
        const [gyms, athletes, vendors, brands, products, competitions] = await Promise.all([
          supabase.from('gyms').select('*'),
          supabase.from('athlete_profiles').select('*'),
          supabase.from('vendors').select('*'),
          supabase.from('brands').select('*'),
          supabase.from('products').select('*'),
          supabase.from('competitions').select('*')
        ]);
        
        const db = this.getSync();
        if(gyms.data) db.gyms = gyms.data;
        if(athletes.data) db.athletes = athletes.data;
        if(vendors.data) db.vendors = vendors.data;
        if(brands.data) db.brands = brands.data;
        if(products.data) db.products = products.data;
        if(competitions.data) db.competitions = competitions.data;

        this.saveSync(db);
      } catch(e) {
        console.error('Supabase sync failed, using fallback', e);
      }
    }

    // Sync versions for UI components that don't await
    getSync() {
      try {
        const raw = localStorage.getItem(DB_KEY);
        return raw ? JSON.parse(raw) : INITIAL_DB;
      } catch (e) {
        return INITIAL_DB;
      }
    }
    
    saveSync(data) {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('athloboard-db-updated', { detail: data }));
      window.dispatchEvent(new CustomEvent('athlo-db-updated', { detail: data }));
    }

    get() {
      // Trigger a background sync if Supabase is present, but return immediately
      if (supabase) this.syncFromSupabase();
      return this.getSync();
    }

    async fetch() {
      if (supabase) await this.syncFromSupabase();
      return this.getSync();
    }

    async save(data) {
      this.saveSync(data);
    }

    async login(email, password, role) {
      if (!supabase) return { success: false, message: 'Supabase offline' };
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, message: error.message };
      
      const session = {
        userId: data.user.id,
        email: data.user.email,
        activeRole: role,
        token: data.session.access_token
      };
      
      const db = this.getSync();
      db.currentSession = session;
      this.saveSync(db);
      return { success: true, session };
    }

    async logout() {
      if(supabase) await supabase.auth.signOut();
      const db = this.getSync();
      db.currentSession = null;
      this.saveSync(db);
      return true;
    }

    getCurrentSession() {
      return this.getSync().currentSession;
    }

    async registerGym(phase1, phase2) {
      if (!supabase) return { success: false, message: 'Supabase offline' };
      const gym = { ...phase1, ...phase2, status: 'PENDING' };
      const { data, error } = await supabase.from('gyms').insert([gym]).select();
      if (error) return { success: false, message: error.message };
      return { success: true, gym: data[0] };
    }

    async registerVendor(data) {
      if (!supabase) return { success: false, message: 'Supabase offline' };
      const vendor = { ...data, status: 'PENDING' };
      const { data: res, error } = await supabase.from('vendors').insert([vendor]).select();
      if (error) return { success: false, message: error.message };
      return { success: true, vendor: res[0] };
    }

    async registerBrand(data) {
      if (!supabase) return { success: false, message: 'Supabase offline' };
      const brand = { ...data, status: 'PENDING' };
      const { data: res, error } = await supabase.from('brands').insert([brand]).select();
      if (error) return { success: false, message: error.message };
      return { success: true, brand: res[0] };
    }

    async addProduct(data) {
      if (!supabase) return { success: false, message: 'Supabase offline' };
      const product = { ...data, status: 'PENDING' };
      const { data: res, error } = await supabase.from('products').insert([product]).select();
      if (error) return { success: false, message: error.message };
      return { success: true, product: res[0] };
    }

    async getPublicVerifiedGyms() {
      const db = await this.get();
      return db.gyms.filter(g => g.status === 'APPROVED');
    }

    async getPublicVerifiedProducts() {
      const db = await this.get();
      return db.products.filter(p => p.status === 'APPROVED');
    }

    async getPublicLeaderboard() {
      const db = await this.get();
      return db.athletes.sort((a, b) => b.total_sbd_kg - a.total_sbd_kg);
    }
  }

  const dbInstance = new AthloboardDB();
  window.AthloboardDB = dbInstance;
  window.GritloopDB = dbInstance;
})(window);
