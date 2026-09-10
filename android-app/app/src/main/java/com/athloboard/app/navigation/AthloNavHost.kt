package com.athloboard.app.navigation

import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Competition
import com.athloboard.app.ui.admin.AdminDashboardScreen
import com.athloboard.app.ui.athlete.community.CommunityScreen
import com.athloboard.app.ui.athlete.competitions.CompetitionDetailScreen
import com.athloboard.app.ui.athlete.competitions.CompetitionsScreen
import com.athloboard.app.ui.athlete.gym.GymDetailScreen
import com.athloboard.app.ui.athlete.gym.GymDiscoveryScreen
import com.athloboard.app.ui.athlete.home.AthleteHomeScreen
import com.athloboard.app.ui.athlete.leaderboard.LeaderboardScreen
import com.athloboard.app.ui.athlete.lift.LiftHistoryScreen
import com.athloboard.app.ui.athlete.lift.LogLiftScreen
import com.athloboard.app.ui.athlete.profile.AthleteProfileSettingsScreen
import com.athloboard.app.ui.athlete.profile.EditProfileScreen
import com.athloboard.app.ui.athlete.rewards.RewardsScreen
import com.athloboard.app.ui.athlete.signup.AthleteSignupScreen
import com.athloboard.app.ui.athlete.store.CouponsWalletScreen
import com.athloboard.app.ui.athlete.store.ProductDetailScreen
import com.athloboard.app.ui.athlete.store.StoreScreen
import com.athloboard.app.ui.auth.GymLoginScreen
import com.athloboard.app.ui.auth.LoginScreen
import com.athloboard.app.ui.auth.OnboardingScreen
import com.athloboard.app.ui.auth.OtpVerificationScreen
import com.athloboard.app.ui.auth.RoleSelectionScreen
import com.athloboard.app.ui.auth.SplashScreen
import com.athloboard.app.ui.brand.BrandRegistrationScreen
import com.athloboard.app.ui.gymowner.GymOwnerDashboardScreen
import com.athloboard.app.ui.gymowner.GymRegistrationScreen
import com.athloboard.app.ui.notifications.NotificationsScreen
import com.athloboard.app.ui.store.AddProductScreen
import com.athloboard.app.ui.vendor.VendorDashboardScreen
import com.athloboard.app.ui.vendor.VendorRegistrationScreen

sealed class Screen(val route: String) {
    object Splash : Screen("splash")
    object Onboarding : Screen("onboarding")
    object RoleSelection : Screen("role_selection")
    object Login : Screen("login")
    object GymLogin : Screen("gym_login")
    object Otp : Screen("otp/{destination}/{role}") {
        fun createRoute(destination: String, role: String) = "otp/$destination/$role"
    }
    // 5 Registration Forms
    object AthleteSignup : Screen("athlete_signup")
    object GymRegistration : Screen("gym_registration")
    object VendorRegistration : Screen("vendor_registration")
    object BrandRegistration : Screen("brand_registration")
    object AddProduct : Screen("add_product")

    // Admin Verification Console
    object AdminDashboard : Screen("admin_dashboard")

    // Role Dashboards
    object AthleteHome : Screen("athlete_home")
    object GymOwnerDashboard : Screen("gym_owner_dashboard")
    object VendorDashboard : Screen("vendor_dashboard")

    // Athlete Features
    object LogLift : Screen("log_lift")
    object LiftHistory : Screen("lift_history")
    object Leaderboard : Screen("leaderboard")
    object GymDiscovery : Screen("gym_discovery")
    object GymDetail : Screen("gym_detail")
    object Store : Screen("store")
    object ProductDetail : Screen("product_detail/{productId}") {
        fun createRoute(productId: String) = "product_detail/$productId"
    }
    object CouponsWallet : Screen("coupons_wallet")
    object Competitions : Screen("competitions")
    object CompetitionDetail : Screen("competition_detail/{competitionId}") {
        fun createRoute(competitionId: String) = "competition_detail/$competitionId"
    }
    object Rewards : Screen("rewards")
    object Community : Screen("community")
    object Profile : Screen("profile")
    object EditProfile : Screen("edit_profile")
    object Notifications : Screen("notifications")
}

@Composable
fun AthloNavHost(
    modifier: Modifier = Modifier
) {
    val navController = rememberNavController()
    val currentGym by AthloRepository.currentGym.collectAsState()
    val competitions by AthloRepository.competitions.collectAsState()

    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route,
        modifier = modifier.fillMaxSize(),
        enterTransition = { slideInHorizontally { it } + fadeIn() },
        exitTransition = { slideOutHorizontally { -it } + fadeOut() },
        popEnterTransition = { slideInHorizontally { -it } + fadeIn() },
        popExitTransition = { slideOutHorizontally { it } + fadeOut() }
    ) {
        // 1. Splash
        composable(Screen.Splash.route) {
            SplashScreen(
                onSplashFinished = {
                    val user = com.google.firebase.auth.FirebaseAuth.getInstance().currentUser
                    if (user != null) {
                        navController.navigate(Screen.AthleteHome.route) {
                            popUpTo(Screen.Splash.route) { inclusive = true }
                        }
                    } else {
                        navController.navigate(Screen.RoleSelection.route) {
                            popUpTo(Screen.Splash.route) { inclusive = true }
                        }
                    }
                }
            )
        }

        // 2. Onboarding
        composable(Screen.Onboarding.route) {
            OnboardingScreen(
                onFinishOnboarding = { navController.navigate(Screen.RoleSelection.route) },
                onSkip = { navController.navigate(Screen.RoleSelection.route) }
            )
        }

        // 3. Role Selection Gateway (Athlete & Gym Portals only in mobile app)
        composable(Screen.RoleSelection.route) {
            RoleSelectionScreen(
                onSelectAthlete = { navController.navigate(Screen.Login.route) },
                onSelectGymOwner = { navController.navigate(Screen.GymLogin.route) }
            )
        }

        // 4. Login Screen (Athlete)
        composable(Screen.Login.route) {
            LoginScreen(
                onBackClick = { navController.popBackStack() },
                onContinueEmail = { email ->
                    navController.navigate(Screen.Otp.createRoute(email, "ATHLETE"))
                },
                onSocialLogin = { _ ->
                    navController.navigate(Screen.AthleteHome.route) {
                        popUpTo(Screen.RoleSelection.route) { inclusive = true }
                    }
                },
                onNavigateToSignup = {
                    navController.navigate(Screen.AthleteSignup.route)
                }
            )
        }

        // 4.1 Gym Partner Login Screen
        composable(Screen.GymLogin.route) {
            GymLoginScreen(
                onBackClick = { navController.popBackStack() },
                onLoginSuccess = {
                    navController.navigate(Screen.GymOwnerDashboard.route) {
                        popUpTo(Screen.RoleSelection.route) { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Screen.GymRegistration.route)
                }
            )
        }

        // 5. OTP Verification Screen
        composable(Screen.Otp.route) { backStackEntry ->
            val destination = backStackEntry.arguments?.getString("destination") ?: "user@athloboard.com"
            val role = backStackEntry.arguments?.getString("role") ?: "ATHLETE"

            OtpVerificationScreen(
                destination = destination,
                onBackClick = { navController.popBackStack() },
                onVerifySuccess = {
                    when (role) {
                        "GYM_OWNER" -> navController.navigate(Screen.GymOwnerDashboard.route) { popUpTo(Screen.RoleSelection.route) { inclusive = true } }
                        "VENDOR", "BRAND" -> navController.navigate(Screen.VendorDashboard.route) { popUpTo(Screen.RoleSelection.route) { inclusive = true } }
                        "ADMIN" -> navController.navigate(Screen.AdminDashboard.route) { popUpTo(Screen.RoleSelection.route) { inclusive = true } }
                        else -> {
                            navController.navigate(Screen.AthleteHome.route) { popUpTo(Screen.RoleSelection.route) { inclusive = true } }
                        }
                    }
                }
            )
        }

        // --- 5 REGISTRATION FORMS ---

        // Form 1: Athlete Signup
        composable(Screen.AthleteSignup.route) {
            AthleteSignupScreen(
                onBackClick = { navController.popBackStack() },
                onSignupComplete = {
                    navController.navigate(Screen.AthleteHome.route) {
                        popUpTo(Screen.RoleSelection.route) { inclusive = true }
                    }
                }
            )
        }

        // Form 2: Gym Registration (Phase 1 & 2)
        composable(Screen.GymRegistration.route) {
            GymRegistrationScreen(
                onBackClick = { navController.popBackStack() },
                onRegistrationSubmitted = {
                    navController.navigate(Screen.GymOwnerDashboard.route) {
                        popUpTo(Screen.RoleSelection.route) { inclusive = true }
                    }
                }
            )
        }

        // Form 3: Local Vendor Registration
        composable(Screen.VendorRegistration.route) {
            VendorRegistrationScreen(
                onBackClick = { navController.popBackStack() },
                onRegistrationSubmitted = {
                    navController.navigate(Screen.VendorDashboard.route) {
                        popUpTo(Screen.RoleSelection.route) { inclusive = true }
                    }
                }
            )
        }

        // Form 4: Brand Registration
        composable(Screen.BrandRegistration.route) {
            BrandRegistrationScreen(
                onBackClick = { navController.popBackStack() },
                onRegistrationSubmitted = {
                    navController.navigate(Screen.VendorDashboard.route) {
                        popUpTo(Screen.RoleSelection.route) { inclusive = true }
                    }
                }
            )
        }

        // Form 5: Product Listing Creation
        composable(Screen.AddProduct.route) {
            AddProductScreen(
                onBackClick = { navController.popBackStack() },
                onProductSubmitted = { navController.popBackStack() }
            )
        }

        // --- ADMIN VERIFICATION CONSOLE ---
        composable(Screen.AdminDashboard.route) {
            AdminDashboardScreen(
                onBackClick = { navController.popBackStack() }
            )
        }

        // --- VENDOR & BRAND DASHBOARD ---
        composable(Screen.VendorDashboard.route) {
            VendorDashboardScreen(
                onBackClick = { navController.popBackStack() },
                onAddNewProductClick = { navController.navigate(Screen.AddProduct.route) }
            )
        }

        // --- GYM OWNER DASHBOARD ---
        composable(Screen.GymOwnerDashboard.route) {
            GymOwnerDashboardScreen(
                onLogout = {
                    navController.navigate(Screen.RoleSelection.route) {
                        popUpTo(0) { inclusive = true }
                    }
                }
            )
        }

        // --- ATHLETE SCREENS ---

        composable(Screen.AthleteHome.route) {
            AthleteHomeScreen(
                athleteName = "Athlete",
                onLogLiftClick = { navController.navigate(Screen.LogLift.route) },
                onViewAllUpcoming = { navController.navigate(Screen.Competitions.route) },
                onOpenLeaderboard = { navController.navigate(Screen.Leaderboard.route) },
                onOpenCompetitions = { navController.navigate(Screen.Competitions.route) },
                onOpenProfile = { navController.navigate(Screen.Profile.route) },
                onOpenGymHub = { navController.navigate(Screen.GymDiscovery.route) },
                onOpenRewards = { navController.navigate(Screen.Rewards.route) },
                onOpenCommunity = { navController.navigate(Screen.Community.route) },
                onOpenStore = { navController.navigate(Screen.Store.route) },
                onOpenNotifications = { navController.navigate(Screen.Notifications.route) }
            )
        }

        composable(Screen.LogLift.route) {
            LogLiftScreen(
                onBackClick = { navController.popBackStack() },
                onViewHistory = {
                    navController.navigate(Screen.LiftHistory.route) {
                        popUpTo(Screen.AthleteHome.route)
                    }
                }
            )
        }

        composable(Screen.LiftHistory.route) {
            LiftHistoryScreen(
                onBackClick = { navController.popBackStack() },
                onLogNewLift = { navController.navigate(Screen.LogLift.route) }
            )
        }

        composable(Screen.Leaderboard.route) {
            LeaderboardScreen(
                onBackClick = { navController.popBackStack() },
                onAthleteClick = { _ -> },
                onOpenHome = {
                    navController.navigate(Screen.AthleteHome.route) {
                        popUpTo(Screen.AthleteHome.route) { inclusive = true }
                    }
                },
                onOpenProfile = { navController.navigate(Screen.Profile.route) }
            )
        }

        composable(Screen.GymDiscovery.route) {
            GymDiscoveryScreen(
                onBackClick = { navController.popBackStack() },
                onGymClick = { _ -> navController.navigate(Screen.GymDetail.route) }
            )
        }

        composable(Screen.GymDetail.route) {
            GymDetailScreen(
                gym = currentGym,
                onBackClick = { navController.popBackStack() },
                onBookPlan = { _ -> navController.popBackStack() }
            )
        }

        composable(Screen.Store.route) {
            StoreScreen(
                onBackClick = { navController.popBackStack() },
                onProductClick = { productId ->
                    navController.navigate(Screen.ProductDetail.createRoute(productId))
                },
                onOpenWallet = { navController.navigate(Screen.CouponsWallet.route) }
            )
        }

        composable(
            route = Screen.ProductDetail.route,
            arguments = listOf(navArgument("productId") { type = NavType.StringType })
        ) { backStackEntry ->
            val productId = backStackEntry.arguments?.getString("productId") ?: "PRD-1"
            ProductDetailScreen(
                productId = productId,
                onBackClick = { navController.popBackStack() },
                onOpenWallet = { navController.navigate(Screen.CouponsWallet.route) }
            )
        }

        composable(Screen.CouponsWallet.route) {
            CouponsWalletScreen(
                onBackClick = { navController.popBackStack() },
                onBrowseStore = {
                    navController.navigate(Screen.Store.route) {
                        popUpTo(Screen.Store.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Competitions.route) {
            CompetitionsScreen(
                onBackClick = { navController.popBackStack() },
                onCompetitionClick = { comp -> navController.navigate(Screen.CompetitionDetail.createRoute(comp.id)) }
            )
        }

        composable(
            route = Screen.CompetitionDetail.route,
            arguments = listOf(navArgument("competitionId") { type = NavType.StringType })
        ) { backStackEntry ->
            val compId = backStackEntry.arguments?.getString("competitionId") ?: "COMP-001"
            val comp = competitions.find { it.id == compId } ?: competitions.firstOrNull() ?: Competition(
                id = "COMP-001",
                title = "National Raw Powerlifting Cup 2026",
                category = "Powerlifting (SBD)",
                date = "Oct 18, 2026",
                time = "08:00 AM IST",
                venue = "Thyagaraj Indoor Sports Complex",
                city = "New Delhi",
                prizePool = "₹ 5,00,000",
                entryFee = 1500,
                rules = "Raw without wraps, IPF Technical Rulebook",
                registeredCount = 48,
                isRegistered = true
            )
            CompetitionDetailScreen(
                competition = comp,
                onBackClick = { navController.popBackStack() },
                onRegisterSuccess = { navController.popBackStack() }
            )
        }

        composable(Screen.Rewards.route) {
            RewardsScreen(
                onBackClick = { navController.popBackStack() }
            )
        }

        composable(Screen.Community.route) {
            CommunityScreen(
                onBackClick = { navController.popBackStack() },
                onOpenHome = {
                    navController.navigate(Screen.AthleteHome.route) {
                        popUpTo(Screen.AthleteHome.route) { inclusive = true }
                    }
                },
                onOpenLeaderboard = { navController.navigate(Screen.Leaderboard.route) },
                onOpenProfile = { navController.navigate(Screen.Profile.route) }
            )
        }

        composable(Screen.Profile.route) {
            AthleteProfileSettingsScreen(
                onBackClick = { navController.popBackStack() },
                onOpenNotifications = { navController.navigate(Screen.Notifications.route) },
                onOpenRewards = { navController.navigate(Screen.Rewards.route) },
                onEditProfile = { navController.navigate(Screen.EditProfile.route) },
                onLogout = {
                    com.google.firebase.auth.FirebaseAuth.getInstance().signOut()
                    navController.navigate(Screen.RoleSelection.route) {
                        popUpTo(0) { inclusive = true }
                    }
                },
                onOpenHome = {
                    navController.navigate(Screen.AthleteHome.route) {
                        popUpTo(Screen.AthleteHome.route) { inclusive = true }
                    }
                },
                onOpenDiscover = { navController.navigate(Screen.Community.route) },
                onOpenActivity = { navController.navigate(Screen.Leaderboard.route) }
            )
        }

        composable(Screen.EditProfile.route) {
            EditProfileScreen(
                onBackClick = { navController.popBackStack() },
                onSaveSuccess = { navController.popBackStack() }
            )
        }

        composable(Screen.Notifications.route) {
            NotificationsScreen(
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}
