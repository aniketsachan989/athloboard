package com.athloboard.app.ui.adapters

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.athloboard.app.data.models.Competition
import com.athloboard.app.databinding.ItemCompetitionBinding

class CompetitionsAdapter(
    private var competitions: List<Competition>,
    private val onRegisterClick: (Competition) -> Unit
) : RecyclerView.Adapter<CompetitionsAdapter.ViewHolder>() {

    inner class ViewHolder(val binding: ItemCompetitionBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemCompetitionBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val comp = competitions[position]
        holder.binding.tvCompTitle.text = comp.title
        holder.binding.tvCompCategory.text = comp.category
        holder.binding.tvCompPrize.text = "Prize: ${comp.prizePool}"
        holder.binding.tvCompVenue.text = "${comp.venue}, ${comp.city} • ${comp.date}"
        holder.binding.btnRegisterComp.text = "ENTER MEET (₹ ${comp.entryFee})"
        holder.binding.btnRegisterComp.setOnClickListener { onRegisterClick(comp) }
    }

    override fun getItemCount() = competitions.size

    fun updateList(newList: List<Competition>) {
        competitions = newList
        notifyDataSetChanged()
    }
}
