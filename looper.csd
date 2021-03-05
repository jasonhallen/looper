<CsoundSynthesizer>
<CsOptions>
-+rtaudio=coreaudio -odac ;-B512 -b128
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 128
nchnls = 2
0dbfs = 1

gishape_hanning ftgen 100,0,4097,20,2,1
gishape_halfsine ftgen 101,0,4097,9,0.5,1,0	
; giShape2 ftgen 101,0,4097,7,1,4096,0
; giShape3 ftgen 102,0,4097,5,1,4096,0.0001
; giShape4 ftgen 103,0,4097,11,1
gibohannon ftgen 1, 0, 0, 1, "bohannon.wav", 0, 0, 1
gimy1 ftgen 2, 0, 0, 1, "my1.wav", 0, 0, 1
giakiko1 ftgen 3, 0, 0, 1, "akiko1.wav", 0, 0, 1
giz_chamberlin2 ftgen 4, 0, 0, 1, "z_chamberlin2.wav", 0, 0, 1
giz_chamberlin6 ftgen 5, 0, 0, 1, "z_chamberlin6.wav", 0, 0, 1
giz_chamberlin7 ftgen 6, 0, 0, 1, "z_chamberlin7.wav", 0, 0, 1
giz_chamberlin11 ftgen 7, 0, 0, 1, "z_chamberlin11.wav", 0, 0, 1
giz_chamberlin17 ftgen 8, 0, 0, 1, "z_chamberlin17.wav", 0, 0, 1
giz_chamberlin20 ftgen 9, 0, 0, 1, "z_chamberlin20.wav", 0, 0, 1
giz_chamberlin21 ftgen 10, 0, 0, 1, "z_chamberlin21.wav", 0, 0, 1
giz_chamberlin22 ftgen 11, 0, 0, 1, "z_chamberlin22.wav", 0, 0, 1
giz_chamberlin24 ftgen 12, 0, 0, 1, "z_chamberlin24.wav", 0, 0, 1
giz_maestro5 ftgen 13, 0, 0, 1, "z_maestro5.wav", 0, 0, 1
giz_mridanga2 ftgen 14, 0, 0, 1, "z_mridanga2.wav", 0, 0, 1
giz_multivox16 ftgen 15, 0, 0, 1, "z_multivox16.wav", 0, 0, 1
giz_nomad5 ftgen 16, 0, 0, 1, "z_nomad5.wav", 0, 0, 1
giz_univox1 ftgen 17, 0, 0, 1, "z_univox1.wav", 0, 0, 1
giz_univox2 ftgen 18, 0, 0, 1, "z_univox2.wav", 0, 0, 1
giz_univox6 ftgen 19, 0, 0, 1, "z_univox6.wav", 0, 0, 1
giz_univox16 ftgen 20, 0, 0, 1, "z_univox16.wav", 0, 0, 1
giz_wurlitzer6 ftgen 21, 0, 0, 1, "z_wurlitzer6.wav", 0, 0, 1
giz_wurlitzer7 ftgen 22, 0, 0, 1, "z_wurlitzer7.wav", 0, 0, 1
giakiko2 ftgen 23, 0, 0, 1, "akiko2.wav", 0, 0, 1
giakiko3 ftgen 24, 0, 0, 1, "akiko3.wav", 0, 0, 1
gipv_kyrie ftgen 25, 0, 0, 1, "pv_kyrie.wav", 0, 0, 1
gipv_hosianna1 ftgen 26, 0, 0, 1, "pv_hosianna1.wav", 0, 0, 1
gipv_hosianna2 ftgen 27, 0, 0, 1, "pv_hosianna2.wav", 0, 0, 1
gipv_maria ftgen 28, 0, 0, 1, "pv_maria.wav", 0, 0, 1
gipv_es ftgen 29, 0, 0, 1, "pv_es.wav", 0, 0, 1
gitoto ftgen 30, 0, 0, 1, "toto.wav", 0, 0, 1
gic_hallel ftgen 31, 0, 0, 1, "c_hallel.wav", 0, 0, 1
gic_luna ftgen 32, 0, 0, 1, "c_luna.wav", 0, 0, 1
gipv_cobra ftgen 33, 0, 0, 1, "pv_cobra.wav", 0, 0, 1
gibaby ftgen 34, 0, 0, 1, "baby.wav", 0, 0, 1
gimy2 ftgen 35, 0, 0, 1, "my2.wav", 0, 0, 1
gimy3 ftgen 36, 0, 0, 1, "my3.wav", 0, 0, 1
gibsoidia1 ftgen 37, 0, 0, 1, "bsoidia1.wav", 0, 0, 1
gibsoidia2 ftgen 38, 0, 0, 1, "bsoidia2.wav", 0, 0, 1
gidciw1 ftgen 39, 0, 0, 1, "dciw1.wav", 0, 0, 1
gidciw2 ftgen 40, 0, 0, 1, "dciw2.wav", 0, 0, 1
gidciw3 ftgen 41, 0, 0, 1, "dciw3.wav", 0, 0, 1
gidciw4 ftgen 42, 0, 0, 1, "dciw4.wav", 0, 0, 1
gidciw5 ftgen 43, 0, 0, 1, "dciw5.wav", 0, 0, 1


; opcode CrossFade a, 
; 	asigl  mincer aphs, kamp, kpitch, kfunction, ilock, 2048, 10
; 	xout aout
; endop

instr 1
	SVolumeChannel sprintf "volume%d", p4
	SSpeedChannel sprintf "speed%d", p4
	SPitchChannel sprintf "pitch%d", p4
	SPanChannel sprintf "pan%d", p4
	SModeChannel sprintf "mode%d", p4
	SModeEndChannel sprintf "mode_end%d", p4
	SResetPhaseChannel sprintf "reset_phase%d", p4
	SClickReleasedChannel sprintf "click_released%d", p4
	SResetCountChannel sprintf "reset_count%d", p4
	SLoopStartChannel sprintf "loop_start%d", p4
	SLoopEndChannel sprintf "loop_end%d", p4
	SCsFunctionChannel sprintf "cs_function%d", p4
	SPlayheadChannel sprintf "playhead%d", p4
	SCrossfadeDurationChannel sprintf "crossfade_duration%d", p4
	SReverbStatusChannel sprintf "reverb_status%d", p4
	SReverbMixChannel sprintf "reverb_mix%d", p4
	SDelayStatusChannel sprintf "delay_status%d", p4
	SDelayMixChannel sprintf "delay_mix%d", p4
	SDelayChannelL sprintf "delayl%d", p4
	SDelayChannelR sprintf "delayr%d", p4
	
	ktimescale init 1
	; kloop_length init ftlen(1)
	kamp init 0.5
	kinst = p1
	kstart = 0
	kdur = p3
	; ifile_length init ftlen(1)
	; print(ifile_length)
	idur  = p3
	ilock = 1
	kpitch = chnget:k(SPitchChannel)
	kpitch = semitone(kpitch)
	ktimescale = chnget:k(SSpeedChannel)
	kamp = chnget:k(SVolumeChannel)
	kreverb_status = chnget:k(SReverbStatusChannel)
	kdelay_status = chnget:k(SDelayStatusChannel)
	chnset 0, SModeEndChannel

	; if kloop_length == 0 then
	;   kloop_length = ifile_length
	; endif

	kreset_phase = chnget:k(SResetPhaseChannel)
	kclick_released init 0
	kclick_released = chnget:k(SClickReleasedChannel)
	; kreset_count init 0
	kreset_count init p5
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
		; 	aphs_crossfade[kndx] = kcrossfade_phase/sr
		; 	kcrossfade_phase = kcrossfade_phase + ktimescale
		; 	if kcrossfade_phase > kend_point + kcrossfade_duration then
		; 		kcrossfade = 0
		; 		; aphs_crossfade = 0
		; 	endif
		; endif/

		; if (ktimescale > 0 && kphs > kloop_end) then
		; 	if kcrossfade == 0 then
		; 		kreset_count += 1
		; 		event "i", 1 + p4/10, 0, -1, p4, kreset_count
		; 		kcrossfade = 1
		; 	endif
		; 	if kcrossfade == 1 then
		; 		if kphs > kloop_end + kcrossfade_duration then
		; 			kcrossfade = 0
		; 			turnoff
		; 		endif
		; 	endif

		; 	; kcrossfade = 1
		; 	; kend_point = kphs
		; 	; kcrossfade_phase = kphs
		; 	; kcrossfade_amp_phase = 0
		; 	; event "i", 2, 0, kcrossfade_duration/(sr*ktimescale), p4, kphs
		; 	; kcrossfade = 1
		; 	; kphs = kloop_start
		; 	; kreset_count += 1
		; elseif (ktimescale < 0 && kphs < kloop_start) then
		; 	kphs = kloop_end
		; 	kreset_count += 1
		; endif

		kndx += 1 
	od

	if (ktimescale > 0 && kphs > kloop_end) then
		kmode = chnget:k(SModeChannel)
		if kcrossfade == 0 then
			kreset_count += 1
			if kmode == 1 then
				event "i", p1, 0, 3600, p4, kreset_count
			else
				chnset k(1), SModeEndChannel
			endif
			kcrossfade = 1
			turnoff
		endif

	elseif (ktimescale < 0 && kphs < kloop_start) then
		kphs = kloop_end
		kreset_count += 1
		; if kcrossfade == 0 then
		; 	kreset_count += 1
		; 	event "i", p1, 0, 3600, p4, kreset_count
		; 	; printks "i %f, 0, -1, p4, %d\n", 0, p1, kreset_count
		; 	kcrossfade = 1
		; 	turnoff
		; endif
	else
		chnset k(aphs)*sr, SPlayheadChannel
	endif
	
	; chnset kphs, "crossfade_out"
	irelease = chnget:i(SCrossfadeDurationChannel)
	kamp_env linsegr 0.00, 0.01, 1, irelease/44100, 0.00
	; printks "%f\n", 0.01, kamp_env
	asigl mincer aphs, kamp*kamp_env, kpitch, kfunction, ilock, 2048, 10

	; if kcrossfade == 1 then
	; 	; kcrossfade_env linseg 0, kcrossfade_duration/(sr*5), 1, kcrossfade_duration*3/(sr*5), 1, kcrossfade_duration/(sr*5), 0
	; 	kcrossfade_env poscil 1, sr*ktimescale/kcrossfade_duration, 100, 1
	; 	chnset kcrossfade_env, "crossfade_out"
	; 	asigl_crossfade mincer aphs_crossfade, kamp*kcrossfade_env, kpitch, kfunction, ilock, 2048, 10
	; 	asigl = asigl + asigl_crossfade
	; endif
	kpan = chnget:k(SPanChannel)
	asigl, asigr pan2 asigl, kpan, 0

	if kdelay_status == 1 then
		; if changed2(kdelay_status) == 1 then
		; 	event "i", 998 + p4/10, 0, -1
		; endif
		; kmain_delay_time = chnget:k("main_delay_time")
		; kdelay_mix = chnget:k(SDelayMixChannel)
		; abufferl delayr	5
		; adelsigl deltap	kmain_delay_time
		; delayw asigl
		; abufferr delayr	5
		; adelsigr deltap	kmain_delay_time
		; delayw asigr
		; asigl ntrpol asigl, adelsigl, kdelay_mix
		; asigr ntrpol asigr, adelsigr, kdelay_mix
		chnmix asigl, SDelayChannelL
		chnmix asigr, SDelayChannelR
	elseif kreverb_status == 1 then
		kreverb_mix = chnget:k(SReverbMixChannel)
		chnmix asigl*(kreverb_mix-1), "mixl"
		chnmix asigr*(kreverb_mix-1), "mixr"
		chnmix asigl*kreverb_mix, "reverbl"
		chnmix asigr*kreverb_mix, "reverbr"
	else
		chnmix asigl, "mixl"
		chnmix asigr, "mixr"
	endif
	; outs asigr, asigl
endin

instr 2 ; Turns off instruments when paused in p5.js

	; SResetCountChannel sprintf "reset_count%d", p4
	; chnset 0, SResetCountChannel
	; chnclear SResetCountChannel
	turnoff2 p4, 4, 0
	turnoff

endin

instr 3 ; Tells whether instrument is currently active

endin
; instr 3 ; Crossfade Player
; 	SPitchChannel sprintf "pitch%d", p4
; 	SSpeedChannel sprintf "speed%d", p4
; 	SVolumeChannel sprintf "volume%d", p4
; 	SResetPhaseChannel sprintf "reset_phase%d", p4
; 	SClickReleasedChannel sprintf "click_released%d", p4
; 	SResetCountChannel sprintf "reset_count%d", p4
; 	SLoopStartChannel sprintf "loop_start%d", p4
; 	SLoopEndChannel sprintf "loop_end%d", p4
; 	SCsFunctionChannel sprintf "cs_function%d", p4
; 	SPlayheadChannel sprintf "playhead%d", p4
; 	SCrossfadeDurationChannel sprintf "crossfade_duration%d", p4
	
; 	ktimescale init 1
; 	kamp init 0.5
; 	idur  = p3
; 	ilock = 1
; 	kpitch = chnget:k(SPitchChannel)
; 	ktimescale = chnget:k(SSpeedChannel)
; 	kamp = chnget:k(SVolumeChannel)
	
; 	aphs init 0
; 	kcrossfade_duration = chnget:k(SCrossfadeDurationChannel)
; 	kfunction = chnget:k(SCsFunctionChannel)
; 	kphs = p5 ;init chnget:i(SLoopStartChannel)

; 	; kndx = 0
; 	; while (kndx < ksmps) do
; 	; 	aphs[kndx] = kphs/sr
; 	; 	kphs = kphs + ktimescale 

; 	; 	; if kcrossfade == 1 then
; 	; 		; aphs_crossfade[kndx] = kcrossfade_phase/sr
; 	; 		; kcrossfade_phase = kcrossfade_phase + ktimescale
; 	; 		; if kcrossfade_phase > kend_point + kcrossfade_duration then
; 	; 		; 	kcrossfade = 0
; 	; 		; 	; aphs_crossfade = 0
; 	; 		; endif
; 	; 	; endif

; 	; 	if (ktimescale > 0 && kphs > kloop_end) then
; 	; 		kend_point = kphs
; 	; 		kcrossfade_phase = kphs
; 	; 		kcrossfade_amp_phase = 0
; 	; 		kcrossfade = 1
; 	; 		kphs = kloop_start
; 	; 		kreset_count += 1
; 	; 	elseif (ktimescale < 0 && kphs < kloop_start) then
; 	; 		kphs = kloop_end
; 	; 		kreset_count += 1
; 	; 	endif

; 	; 	kndx += 1 
; 	; od

; 	aphs phasor (sr*ktimescale)/(kcrossfade_duration)
; 	aphs = aphs * kcrossfade_duration/sr + kphs/sr
; 	aphs_amp init 0
; 	; kamp_env poscil3 1, 1/p3, 101
; 	kamp_phs phasor 1/p3
; 	; kndx = 0
; 	; while (kndx < ksmps) do
; 	; 	aphs_amp[kndx] = kphs_amp/sr
; 	; 	kphs_amp = kphs_amp + ktimescale 
; 	; 	kndx += 1 
; 	; od 
; 	kamp_env = a((tablei:k((kamp_phs/2), 103, 1) + 1)/2)
; 	asigl mincer aphs, kamp*kamp_env, kpitch, kfunction, ilock, 2048, 10
; 	; chnset kamp_phs, "crossfade_out"
; 	; chnset k(aphs)*sr, SPlayheadChannel

; 	; if kcrossfade == 1 then
; 	; 	; kcrossfade_env linseg 0, kcrossfade_duration/(sr*5), 1, kcrossfade_duration*3/(sr*5), 1, kcrossfade_duration/(sr*5), 0
; 	; 	asigl_crossfade mincer aphs_crossfade, kamp*kcrossfade_env, kpitch, kfunction, ilock, 2048, 10
; 	; 	asigl = asigl + asigl_crossfade
; 	; endif

; 	asigr = asigl
; 	outs asigr, asigl
; endin

instr 998 ; DELAY
	SDelayMixChannel sprintf "delay_mix%d", p4
	SDelayChannelL sprintf "delayl%d", p4
	SDelayChannelR sprintf "delayr%d", p4
	SReverbStatusChannel sprintf "reverb_status%d", p4
	SReverbMixChannel sprintf "reverb_mix%d", p4
	asigl chnget SDelayChannelL
	asigr chnget SDelayChannelR

	kmain_delay_time = chnget:k("main_delay_time")
	kdelay_mix = chnget:k(SDelayMixChannel)
	kreverb_status = chnget:k(SReverbStatusChannel)
	abufferl delayr	5
	adelsigl deltap	kmain_delay_time
	delayw asigl
	abufferr delayr	5
	adelsigr deltap	kmain_delay_time
	delayw asigr
	; asigl ntrpol asigl, adelsigl, kdelay_mix
	; asigr ntrpol asigr, adelsigr, kdelay_mix

	asigl = asigl*tablei:k((kdelay_mix + 1) *0.5 , gishape_halfsine, 1) + adelsigl*tablei:k((kdelay_mix + 0) *0.5 , gishape_halfsine, 1)
	asigr = asigr*tablei:k((kdelay_mix + 1) *0.5 , gishape_halfsine, 1) + adelsigr*tablei:k((kdelay_mix + 0) *0.5 , gishape_halfsine, 1)

	if kreverb_status == 1 then
		kreverb_mix = chnget:k(SReverbMixChannel)
		; chnmix asigl*(kreverb_mix-1), "mixl"
		; chnmix asigr*(kreverb_mix-1), "mixr"
		; chnmix asigl*kreverb_mix, "reverbl"
		; chnmix asigr*kreverb_mix, "reverbr"
		chnmix asigl*tablei:k((kreverb_mix + 1) *0.5 , gishape_halfsine, 1), "mixl"
		chnmix asigr*tablei:k((kreverb_mix + 1) *0.5 , gishape_halfsine, 1), "mixr"
		chnmix asigl*tablei:k((kreverb_mix + 0) *0.5 , gishape_halfsine, 1), "reverbl"
		chnmix asigr*tablei:k((kreverb_mix + 0) *0.5 , gishape_halfsine, 1), "reverbr"
	else
		chnmix asigl, "mixl"
		chnmix asigr, "mixr"
	endif
	chnclear SDelayChannelL, SDelayChannelR
endin

instr 999 ; REVERB
	asigl chnget "reverbl"
	asigr chnget "reverbr"
	kmain_reverb_size = chnget:k("main_reverb_size")
	kmain_reverb_cutoff = chnget:k("main_reverb_cutoff")
	asigl, asigr freeverb asigl, asigr, kmain_reverb_size, kmain_reverb_cutoff
	; chnmix asigl*3, "main_reverbl"
	; chnmix asigr*3, "main_reverbr"
	chnmix asigl*3, "mixl"
	chnmix asigr*3, "mixr"
endin

instr 1000 ; MAIN MIXER
	; kmain_reverb_status = chnget:k("main_reverb_status")

	asigl chnget "mixl"
    asigr chnget "mixr"
    ;asigl butterlp asigl, 5000
    ;asigr butterlp asigr, 5000

	; if kmain_reverb_status == 1 then
	; 	areverbl chnget "main_reverbl"
	; 	areverbr chnget "main_reverbr"
	; 	kmain_reverb_mix = chnget:k("main_reverb_mix")
	; 	asigl ntrpol asigl, areverbl, kmain_reverb_mix
	; 	asigr ntrpol asigr, areverbr, kmain_reverb_mix
	; endif

    kmain_volume = chnget:k("main_volume")
	outs asigl * kmain_volume, asigr * kmain_volume

	ktrig metro 15
	kleft_meter max_k asigl * kmain_volume, ktrig, 1
	kright_meter max_k asigr * kmain_volume, ktrig, 1
	chnset kleft_meter, "left_meter"
	chnset kright_meter, "right_meter"

    chnclear "mixl", "mixr", "reverbl", "reverbr", "main_reverbl", "main_reverbr", "delayl", "delayr"
endin

</CsInstruments>
<CsScore>
f0 z
i 999 0 -1
i 1000 0 -1
</CsScore>
</CsoundSynthesizer>
