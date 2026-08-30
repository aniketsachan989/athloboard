package com.athloboard.app.ui.competitions

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.databinding.FragmentCompetitionsBinding
import com.athloboard.app.ui.adapters.CompetitionsAdapter
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class CompetitionsFragment : Fragment() {

    private var _binding: FragmentCompetitionsBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: CompetitionsAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCompetitionsBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = CompetitionsAdapter(emptyList()) { comp ->
            Toast.makeText(requireContext(), "Registration confirmed for ${comp.title} (Fee: ₹${comp.entryFee})", Toast.LENGTH_LONG).show()
        }

        binding.rvCompetitions.layoutManager = LinearLayoutManager(requireContext())
        binding.rvCompetitions.adapter = adapter

        viewLifecycleOwner.lifecycleScope.launch {
            AthloRepository.competitions.collectLatest { list ->
                adapter.updateList(list)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
