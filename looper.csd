<CsoundSynthesizer>
<CsOptions>
-+rtaudio=coreaudio -odac
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1

giShape ftgen 100,0,4097,20,2,1
giShape ftgen 101,0,4097,7,1,4096,0
giShape ftgen 102,0,4097,5,1,4096,0.0001
giShape ftgen 103,0,4097,11,1
gibohannon ftgen 1, 0, 0, 1, "bohannon.wav", 0, 0, 1
gimygirl ftgen 2, 0, 0, 1, "my_girl_2.wav", 0, 0, 1
giakiko1 ftgen 3, 0, 0, 1, "akiko1.wav", 0, 0, 1

; opcode CrossFade a, 
; 	asigl  mincer aphs, kamp, kpitch, kfunction, ilock, 2048, 10
; 	xout aout
; endop

instr 1
	SPitchChannel sprintf "pitch%d", p4
	SSpeedChannel sprintf "speed%d", p4
	SVolumeChannel sprintf "volume%d", p4
	SResetPhaseChannel sprintf "reset_phase%d", p4
	SClickReleasedChannel sprintf "click_released%d", p4
	SResetCountChannel sprintf "reset_count%d", p4
	SLoopStartChannel sprintf "loop_start%d", p4
	SLoopEndChannel sprintf "loop_end%d", p4
	SCsFunctionChannel sprintf "cs_function%d", p4
	SPlayheadChannel sprintf "playhead%d", p4
	SCrossfadeDurationChannel sprintf "crossfade_duration%d", p4
	
	ktimescale init 1
	; kloop_length init ftlen(1)
	kamp init 0.5
	; ifile_length init ftlen(1)
	; print(ifile_length)
	idur  = p3
	ilock = 1
	kpitch = chnget:k(SPitchChannel)
	ktimescale = chnget:k(SSpeedChannel)
	kamp = chnget:k(SVolumeChannel)

	; if kloop_length == 0 then
	;   kloop_length = ifile_length
	; endif

	kreset_phase = chnget:k(SResetPhaseChannel)
	kclick_released init 0
	kclick_released = chnget:k(SClickReleasedChannel)
	kreset_count init 0
	chnset kreset_count, SResetCountChannel
	
	aphs init 0
	kloop_start = chnget:k(SLoopStartChannel)
	kloop_end = chnget:k(SLoopEndChannel)
	kfunction = chnget:k(SCsFunctionChannel)
	kphs init chnget:i(SLoopStartChannel)
	
	if changed2(kreset_phase) == 1 then
		kphs = kloop_start
		kreset_count += 1
	endif

	; if changed2(kclick_released) == 1 then
	; 	kloop_start = chnget:k(SLoopStartChannel)
	; 	kloop_length = chnget:k("loop_length")
	; endif

	aphs_crossfade init 0
	kcrossfade_duration = chnget:k(SCrossfadeDurationChannel)
	kcrossfade init 0
	kcrossfade_phase init 0
	kend_point init 0

	kndx = 0
	while (kndx < ksmps) do
		aphs[kndx] = kphs/sr
		kphs = kphs + ktimescale 

		; if kcrossfade == 1 then
			; aphs_crossfade[kndx] = kcrossfade_phase/sr
			; kcrossfade_phase = kcrossfade_phase + ktimescale
			; if kcrossfade_phase > kend_point + kcrossfade_duration then
			; 	kcrossfade = 0
			; 	; aphs_crossfade = 0
			; endif
		; endif

		if (ktimescale > 0 && kphs > kloop_end) then
			kend_point = kphs
			kcrossfade_phase = kphs
			kcrossfade_amp_phase = 0
			kcrossfade = 1
			event "i", 2, 0, kcrossfade_duration/(sr*ktimescale), p4, kphs
			kphs = kloop_start
			kreset_count += 1
		elseif (ktimescale < 0 && kphs < kloop_start) then
			kphs = kloop_end
			kreset_count += 1
		endif

		kndx += 1 
	od
	asigl mincer aphs, kamp, kpitch, kfunction, ilock, 2048, 10
	chnset k(aphs)*sr, SPlayheadChannel

	; if kcrossfade == 1 then
	; 	; kcrossfade_env linseg 0, kcrossfade_duration/(sr*5), 1, kcrossfade_duration*3/(sr*5), 1, kcrossfade_duration/(sr*5), 0
	; 	kcrossfade_env poscil 1, sr*ktimescale/kcrossfade_duration, 100, 1
	; 	chnset kcrossfade_env, "crossfade_out"
	; 	asigl_crossfade mincer aphs_crossfade, kamp*kcrossfade_env, kpitch, kfunction, ilock, 2048, 10
	; 	asigl = asigl + asigl_crossfade
	; endif

	asigr = asigl
	outs asigr, asigl
endin

instr 2 ; Crossfade Player
	
	; kloop_length init ftlen(1)
	; ifile_length init ftlen(1)
	; print(ifile_length)

	; if kloop_length == 0 then
	;   kloop_length = ifile_length
	; endif

	; kreset_phase = chnget:k(SResetPhaseChannel)
	; kclick_released init 0
	; kclick_released = chnget:k(SClickReleasedChannel)
	; kreset_count init 0
	; chnset kreset_count, SResetCountChannel
	
	; kloop_start = chnget:k(SLoopStartChannel)
	; kloop_end = chnget:k(SLoopEndChannel)
	
	; if changed2(kreset_phase) == 1 then
	; 	kphs = kloop_start
	; 	kreset_count += 1
	; endif

	; if changed2(kclick_released) == 1 then
	; 	kloop_start = chnget:k(SLoopStartChannel)
	; 	kloop_length = chnget:k("loop_length")
	; endif

	; aphs_crossfade init 0
	; kcrossfade init 0
	; kcrossfade_phase init 0
	; kend_point init 0
	

	SPitchChannel sprintf "pitch%d", p4
	SSpeedChannel sprintf "speed%d", p4
	SVolumeChannel sprintf "volume%d", p4
	SResetPhaseChannel sprintf "reset_phase%d", p4
	SClickReleasedChannel sprintf "click_released%d", p4
	SResetCountChannel sprintf "reset_count%d", p4
	SLoopStartChannel sprintf "loop_start%d", p4
	SLoopEndChannel sprintf "loop_end%d", p4
	SCsFunctionChannel sprintf "cs_function%d", p4
	SPlayheadChannel sprintf "playhead%d", p4
	SCrossfadeDurationChannel sprintf "crossfade_duration%d", p4
	
	ktimescale init 1
	kamp init 0.5
	idur  = p3
	ilock = 1
	kpitch = chnget:k(SPitchChannel)
	ktimescale = chnget:k(SSpeedChannel)
	kamp = chnget:k(SVolumeChannel)
	
	aphs init 0
	kcrossfade_duration = chnget:k(SCrossfadeDurationChannel)
	kfunction = chnget:k(SCsFunctionChannel)
	kphs = p5 ;init chnget:i(SLoopStartChannel)

	; kndx = 0
	; while (kndx < ksmps) do
	; 	aphs[kndx] = kphs/sr
	; 	kphs = kphs + ktimescale 

	; 	; if kcrossfade == 1 then
	; 		; aphs_crossfade[kndx] = kcrossfade_phase/sr
	; 		; kcrossfade_phase = kcrossfade_phase + ktimescale
	; 		; if kcrossfade_phase > kend_point + kcrossfade_duration then
	; 		; 	kcrossfade = 0
	; 		; 	; aphs_crossfade = 0
	; 		; endif
	; 	; endif

	; 	if (ktimescale > 0 && kphs > kloop_end) then
	; 		kend_point = kphs
	; 		kcrossfade_phase = kphs
	; 		kcrossfade_amp_phase = 0
	; 		kcrossfade = 1
	; 		kphs = kloop_start
	; 		kreset_count += 1
	; 	elseif (ktimescale < 0 && kphs < kloop_start) then
	; 		kphs = kloop_end
	; 		kreset_count += 1
	; 	endif

	; 	kndx += 1 
	; od

	aphs phasor (sr*ktimescale)/(kcrossfade_duration)
	aphs = aphs * kcrossfade_duration/sr + kphs/sr
	aphs_amp init 0
	; kamp_env poscil3 1, 1/p3, 101
	kamp_phs phasor 1/p3
	; kndx = 0
	; while (kndx < ksmps) do
	; 	aphs_amp[kndx] = kphs_amp/sr
	; 	kphs_amp = kphs_amp + ktimescale 
	; 	kndx += 1 
	; od 
	kamp_env = a((tablei:k((kamp_phs/2), 103, 1) + 1)/2)
	asigl mincer aphs, kamp*kamp_env, kpitch, kfunction, ilock, 2048, 10
	chnset kamp_phs, "crossfade_out"
	; chnset k(aphs)*sr, SPlayheadChannel

	; if kcrossfade == 1 then
	; 	; kcrossfade_env linseg 0, kcrossfade_duration/(sr*5), 1, kcrossfade_duration*3/(sr*5), 1, kcrossfade_duration/(sr*5), 0
	; 	asigl_crossfade mincer aphs_crossfade, kamp*kcrossfade_env, kpitch, kfunction, ilock, 2048, 10
	; 	asigl = asigl + asigl_crossfade
	; endif

	asigr = asigl
	outs asigr, asigl
endin

</CsInstruments>
<CsScore>
; f0 z
</CsScore>
</CsoundSynthesizer>
