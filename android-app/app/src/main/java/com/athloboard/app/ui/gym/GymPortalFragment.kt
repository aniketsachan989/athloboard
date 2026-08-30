package com.athloboard.app.ui.gym

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.databinding.FragmentGymPortalBinding
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class GymPortalFragment : Fragment() {

    private var _binding: FragmentGymPortalBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentGymPortalBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        viewLifecycleOwner.lifecycleScope.launch {
            AthloRepository.currentGym.collectLatest { gym ->
                binding.tvGymName.text = gym.gymName
                binding.tvGymLocation.text = "${gym.location} • Landmark: ${gym.landmark}"
                binding.tvPlatesWeight.text = "${String.format("%,d", gym.plateWeightKg)} kg"
                binding.tvDumbbellsWeight.text = "${String.format("%,d", gym.dumbbellWeightKg)} kg"
                binding.tvTrainersCount.text = "${gym.trainerMaleCount}M / ${gym.trainerFemaleCount}F"
                binding.tvMonthlyCharge.text = "₹ ${String.format("%,d", gym.chargesMonthly)} / month"
            }
        }

        binding.btnBookPass.setOnClickListener {
            Toast.makeText(requireContext(), "Member Pass booked! Digital pass generated.", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
