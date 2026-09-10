package com.athloboard.app.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.athloboard.app.R
import com.athloboard.app.data.models.Athlete
import com.athloboard.app.databinding.ItemLeaderboardAthleteBinding
import com.bumptech.glide.Glide

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

        // Podium rank colors
        val rankColor = when (position) {
            0 -> ContextCompat.getColor(holder.itemView.context, R.color.color_amber)
            1 -> ContextCompat.getColor(holder.itemView.context, R.color.color_cyan)
            2 -> ContextCompat.getColor(holder.itemView.context, R.color.color_volt)
            else -> ContextCompat.getColor(holder.itemView.context, R.color.text_secondary)
        }
        holder.binding.tvRankNumber.setTextColor(rankColor)

        if (athlete.avatarUrl.isNotEmpty()) {
            Glide.with(holder.itemView.context)
                .load(athlete.avatarUrl)
                .circleCrop()
                .into(holder.binding.ivAthleteAvatar)
        } else {
            holder.binding.ivAthleteAvatar.setImageResource(R.drawable.ic_user)
        }

        holder.binding.root.setOnClickListener { onItemClick(athlete) }
    }

    override fun getItemCount() = athletes.size

    fun updateList(newList: List<Athlete>) {
        athletes = newList
        notifyDataSetChanged()
    }
}
