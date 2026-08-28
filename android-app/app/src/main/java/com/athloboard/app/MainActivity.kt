package com.athloboard.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.athloboard.app.databinding.ActivityMainBinding
import com.athloboard.app.ui.competitions.CompetitionsFragment
import com.athloboard.app.ui.gym.GymPortalFragment
import com.athloboard.app.ui.leaderboard.LeaderboardFragment
import com.athloboard.app.ui.profile.AthleteProfileFragment
import com.athloboard.app.ui.recorder.LiftRecorderFragment

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Load default fragment (Athlete Profile)
        if (savedInstanceState == null) {
            loadFragment(AthleteProfileFragment())
        }

        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_profile -> {
                    loadFragment(AthleteProfileFragment())
                    true
                }
                R.id.nav_leaderboard -> {
                    loadFragment(LeaderboardFragment())
                    true
                }
                R.id.nav_recorder -> {
                    loadFragment(LiftRecorderFragment())
                    true
                }
                R.id.nav_competitions -> {
                    loadFragment(CompetitionsFragment())
                    true
                }
                R.id.nav_gym -> {
                    loadFragment(GymPortalFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}
