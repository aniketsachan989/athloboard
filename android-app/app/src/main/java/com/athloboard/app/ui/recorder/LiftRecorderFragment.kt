package com.athloboard.app.ui.recorder

import android.os.Bundle
import android.os.CountDownTimer
import android.os.Handler
import android.os.Looper
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.athloboard.app.data.AthloRepository
import com.athloboard.app.databinding.FragmentLiftRecorderBinding

class LiftRecorderFragment : Fragment() {

    private var _binding: FragmentLiftRecorderBinding? = null
    private val binding get() = _binding!!

    private var isRecording = false
    private var secondsElapsed = 0
    private val timerHandler = Handler(Looper.getMainLooper())
    private val timerRunnable = object : Runnable {
        override fun run() {
            secondsElapsed++
            val mins = secondsElapsed / 60
            val secs = secondsElapsed % 60
            binding.tvTimer.text = String.format("%02d:%02d:%02d", 0, mins, secs)
            timerHandler.postDelayed(this, 1000)
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLiftRecorderBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Setup lift types spinner
        val liftTypes = arrayOf("Squat (SBD)", "Bench Press (Paused)", "Deadlift (Conventional)", "Deadlift (Sumo)")
        val adapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_dropdown_item, liftTypes)
        binding.spnLiftType.adapter = adapter

        binding.btnRecord.setOnClickListener {
            startCountdownAndRecord()
        }

        binding.btnSubmitAdmin.setOnClickListener {
            submitRecordedLift()
        }
    }

    private fun startCountdownAndRecord() {
        binding.tvCountdown.visibility = View.VISIBLE
        binding.btnRecord.isEnabled = false

        object : CountDownTimer(3000, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                val sec = (millisUntilFinished / 1000) + 1
                binding.tvCountdown.text = sec.toString()
            }

            override fun onFinish() {
                binding.tvCountdown.visibility = View.GONE
                isRecording = true
                secondsElapsed = 0
                timerHandler.post(timerRunnable)

                binding.btnRecord.visibility = View.GONE
                binding.btnSubmitAdmin.visibility = View.VISIBLE
                Toast.makeText(requireContext(), "Recording Lift... Depth Line Active", Toast.LENGTH_SHORT).show()
            }
        }.start()
    }

    private fun submitRecordedLift() {
        timerHandler.removeCallbacks(timerRunnable)
        isRecording = false

        val liftType = binding.spnLiftType.selectedItem.toString()
        val weight = binding.etClaimedWeight.text.toString().toIntOrNull() ?: 225

        val submission = AthloRepository.submitLiftVideo(liftType, weight)

        Toast.makeText(
            requireContext(),
            "Lift of ${submission.claimedWeight}kg ($liftType) Submitted to Supabase Referee Queue!",
            Toast.LENGTH_LONG
        ).show()

        binding.btnSubmitAdmin.visibility = View.GONE
        binding.btnRecord.visibility = View.VISIBLE
        binding.btnRecord.isEnabled = true
        binding.tvTimer.text = "00:00:00"
    }

    override fun onDestroyView() {
        super.onDestroyView()
        timerHandler.removeCallbacks(timerRunnable)
        _binding = null
    }
}
