package com.athloboard.app.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.athloboard.app.data.models.Athlete
import com.athloboard.app.databinding.ItemLeaderboardAthleteBinding

class LeaderboardAdapter(
    private var athletes: List<Athlete>,
    private val onItemClick: (Athlete) -> Unit
) : RecyclerView.Adapter<LeaderboardAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemLeaderboardAthleteBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemLeaderboardAthleteBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val athlete = athletes[position]
        holder.binding.tvRankNumber.text = "#${position + 1}"
        holder.binding.tvAthleteName.text = athlete.name
        holder.binding.tvAthleteSub.text = "${athlete.gymName} • ${athlete.weightClass}"
        holder.binding.tvAthleteTotal.text = "${athlete.total} kg"
        holder.binding.root.setOnClickListener { onItemClick(athlete) }
    }

    override fun getItemCount() = athletes.size

    fun updateList(newList: List<Athlete>) {
        athletes = newList
        notifyDataSetChanged()
    }
}
