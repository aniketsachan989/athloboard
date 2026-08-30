package com.athloboard.app.ui.onboarding

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.athloboard.app.R
import com.athloboard.app.databinding.FragmentOnboardingBinding
import com.athloboard.app.ui.profile.AthleteProfileFragment

class OnboardingFragment : Fragment() {

    private var _binding: FragmentOnboardingBinding? = null
    private val binding get() = _binding!!
    private var currentStep = 1

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentOnboardingBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.btnSkip.setOnClickListener {
            finishOnboarding()
        }

        binding.btnOnboardingNext.setOnClickListener {
            if (currentStep == 1) {
                currentStep = 2
                renderStep2()
            } else {
                finishOnboarding()
            }
        }

        binding.btnOnboardingBack.setOnClickListener {
            if (currentStep == 2) {
                currentStep = 1
                renderStep1()
            }
        }
    }

    private fun renderStep1() {
        binding.dashStep1.setBackgroundColor(ContextCompat.getColor(requireContext(), R.color.text_main))
        binding.dashStep2.setBackgroundColor(ContextCompat.getColor(requireContext(), R.color.border_pill))
        binding.tvWelcomeTag.text = "Welcome to"
        binding.tvHeadline.text = "Next-level\nstrength verification"
        binding.tvSubheadline.text = "Track your SBD PRs, video-refereed lifts, and audited gym barbell capacities with real-time accuracy and progress insights."
        binding.tvNextBtnLabel.text = "Continue"
    }

    private fun renderStep2() {
        binding.dashStep1.setBackgroundColor(ContextCompat.getColor(requireContext(), R.color.border_pill))
        binding.dashStep2.setBackgroundColor(ContextCompat.getColor(requireContext(), R.color.text_main))
        binding.tvWelcomeTag.text = "Verified Community"
        binding.tvHeadline.text = "You're in Good\nCompany!"
        binding.tvSubheadline.text = "Connect with 10,000+ verified athletes and powerlifters for authentic leaderboard competition and growth."
        binding.tvNextBtnLabel.text = "Start Exploring"
    }

    private fun finishOnboarding() {
        parentFragmentManager.beginTransaction()
            .setCustomAnimations(android.R.anim.fade_in, android.R.anim.fade_out)
            .replace(R.id.fragment_container, AthleteProfileFragment())
            .commit()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
