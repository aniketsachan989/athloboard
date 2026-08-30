package com.athloboard.app.ui.leaderboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.athloboard.app.R
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.data.models.Athlete
import com.athloboard.app.databinding.FragmentLeaderboardBinding
import com.athloboard.app.ui.adapters.LeaderboardAdapter
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class LeaderboardFragment : Fragment() {

    private var _binding: FragmentLeaderboardBinding? = null
    private val binding get() = _binding!!
    private lateinit var adapter: LeaderboardAdapter
    private var allAthletes: List<Athlete> = emptyList()
    private var selectedCategory = "ALL"

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLeaderboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        adapter = LeaderboardAdapter(emptyList()) { athlete ->
            Toast.makeText(
                requireContext(),
                "${athlete.name}: Squat ${athlete.prSquat}kg | Bench ${athlete.prBench}kg | Deadlift ${athlete.prDeadlift}kg (Total: ${athlete.total}kg)",
                Toast.LENGTH_LONG
            ).show()
        }

        binding.rvLeaderboard.layoutManager = LinearLayoutManager(requireContext())
        binding.rvLeaderboard.adapter = adapter

        viewLifecycleOwner.lifecycleScope.launch {
            AthloRepository.leaderboard.collectLatest { list ->
                allAthletes = list
                applyFilter(selectedCategory)
            }
        }

        setupFilterButtons()
    }

    private fun setupFilterButtons() {
        val filterButtons = listOf(
            Pair(binding.btnFilterAll, "ALL"),
            Pair(binding.btnFilter83kg, "83kg"),
            Pair(binding.btnFilter93kg, "93kg"),
            Pair(binding.btnFilter105kg, "105kg")
        )

        filterButtons.forEach { (button, category) ->
            button.setOnClickListener {
                selectedCategory = category
                highlightFilterButton(button, filterButtons.map { it.first })
                applyFilter(category)
            }
        }
    }

    private fun highlightFilterButton(activeBtn: TextView, allBtns: List<TextView>) {
        allBtns.forEach { btn ->
            if (btn == activeBtn) {
                btn.background = ContextCompat.getDrawable(requireContext(), R.drawable.bg_active_pill)
                btn.setTextColor(ContextCompat.getColor(requireContext(), R.color.text_main))
            } else {
                btn.background = ContextCompat.getDrawable(requireContext(), R.drawable.bg_frosted_pill)
                btn.setTextColor(ContextCompat.getColor(requireContext(), R.color.text_secondary))
            }
        }
    }

    private fun applyFilter(category: String) {
        val filtered = if (category == "ALL") {
            allAthletes
        } else {
            allAthletes.filter { it.weightClass.contains(category, ignoreCase = true) }
        }
        adapter.updateList(filtered)
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
