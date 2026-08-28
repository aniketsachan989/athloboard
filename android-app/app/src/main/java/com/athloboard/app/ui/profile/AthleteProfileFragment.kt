package com.athloboard.app.ui.profile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.databinding.FragmentAthleteProfileBinding
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

        viewLifecycleOwner.lifecycleScope.launch {
            AthloRepository.currentAthlete.collectLatest { athlete ->
                binding.tvAthleteName.text = athlete.name
                binding.tvBadge.text = "${athlete.badge} • ${athlete.weightClass}"
                binding.tvGymName.text = athlete.gymName
                binding.tvRank.text = "#${athlete.rank}"
                binding.tvSquatPr.text = "${athlete.prSquat} kg"
                binding.tvBenchPr.text = "${athlete.prBench} kg"
                binding.tvDeadliftPr.text = "${athlete.prDeadlift} kg"
                binding.tvTotalPr.text = "${athlete.total} kg"
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
