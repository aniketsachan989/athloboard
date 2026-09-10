package com.athloboard.app.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.athloboard.app.R
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.databinding.FragmentAthleteProfileBinding
import com.athloboard.app.ui.recorder.LiftRecorderFragment
import com.bumptech.glide.Glide
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class AthleteProfileFragment : Fragment() {

    private var _binding: FragmentAthleteProfileBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAthleteProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Observe live athlete data from AthloRepository & Supabase
        viewLifecycleOwner.lifecycleScope.launch {
            AthloRepository.currentAthlete.collectLatest { athlete ->
                binding.tvAthleteName.text = "Hello, ${athlete.name.split(" ").firstOrNull() ?: athlete.name}"
                binding.tvBadge.text = "⚡ National Rank: #${athlete.rank} • ${athlete.weightClass}"
                binding.tvGymName.text = "Today • ${athlete.gymName}"
                binding.tvRank.text = "#${athlete.rank} India"
                binding.tvSquatPr.text = "${athlete.prSquat} kg"
                binding.tvBenchPr.text = "${athlete.prBench} kg"
                binding.tvDeadliftPr.text = "${athlete.prDeadlift} kg"
                binding.tvTotalPr.text = "${athlete.total} kg"

                if (athlete.avatarUrl.isNotEmpty()) {
                    Glide.with(this@AthleteProfileFragment)
                        .load(athlete.avatarUrl)
                        .circleCrop()
                        .into(binding.ivAvatar)
                }
            }
        }

        // Interactive HUD buttons
        binding.btnNotifications.setOnClickListener {
            Toast.makeText(requireContext(), "You have 1 new lift referee verification result!", Toast.LENGTH_SHORT).show()
        }

        binding.btnQuickAction.setOnClickListener {
            // Navigate directly to Lift Recorder Camera HUD
            parentFragmentManager.beginTransaction()
                .setCustomAnimations(android.R.anim.fade_in, android.R.anim.fade_out)
                .replace(R.id.fragment_container, LiftRecorderFragment())
                .commit()
        }

        binding.tvViewAllGoals.setOnClickListener {
            Toast.makeText(requireContext(), "Opening SBD Power Metrics details...", Toast.LENGTH_SHORT).show()
        }

        binding.tvViewAllActivities.setOnClickListener {
            Toast.makeText(requireContext(), "Viewing complete video-refereed lift history...", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
