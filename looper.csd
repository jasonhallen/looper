<CsoundSynthesizer>
<CsOptions>
-+rtaudio=coreaudio -odac
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 32
nchnls = 2
0dbfs = 1

gisample1 ftgen 1, 0, 0, 1, "bohannon.wav", 0, 0, 1
;gisample2 ftgen 1, 0, 0, 1, "daughter_mono.wav", 0, 0, 1

instr 1
	ktimescale init 1
	kloop_length init ftlen(1)
	kamp init 0.5
	ifile_length init ftlen(1)
	print(ifile_length)
	idur  = p3
	ilock = 1
	kpitch = chnget:k("pitch")
	ktimescale = chnget:k("speed")
	kamp  = chnget:k("volume")
	kloop_start init chnget:i("loop_start")
	kloop_length init chnget:i("loop_length")
	; kloop_start = chnget:k("loop_start")
	kloop_start_continuous = chnget:k("loop_start_continuous")
	if kloop_start_continuous == 1 then
		kloop_start = chnget:k("loop_start")
	endif
	kloop_length_continuous = chnget:k("loop_length_continuous")
	if kloop_length_continuous == 1 then
		kloop_length = chnget:k("loop_length")
	endif
	if kloop_length == 0 then
	  kloop_length = ifile_length
	endif
	kreset_phase = chnget:k("reset_phase")
	kclick_released init 0
	kclick_released = chnget:k("click_released")
	kreset_count init 0

	; atime phasor (sr*ktimescale)/(kloop_length)
	; atime = atime * kloop_length/sr + kloop_start/sr 
	; asigl  mincer atime, kamp, kpitch, 1, ilock, 2048, 10
	; chnset k(atime)*sr, "playhead"
	
	aphs init 0
	kphs init 0
	kphsperiod = kloop_length ;; * sr ;; start with .25 second for phs
	
	kndx = 0
	
	if changed2(kreset_phase) == 1 then
		kphs = 0
		kloop_start = chnget:k("loop_start")
		kloop_length = chnget:k("loop_length")
		kreset_count += 1
	endif

	if changed2(kclick_released) == 1 then
		kloop_start = chnget:k("loop_start")
		kloop_length = chnget:k("loop_length")
	endif

	while (kndx < ksmps) do
		; aphs[kndx] = (kphs/kloop_length)*kloop_length/sr + kloop_start/sr
		aphs[kndx] = (kphs + kloop_start)/sr
		kphs = kphs + 1*ktimescale 
		if (kphs > kloop_length) then
			kphs = 0 ;kphs -= kphsperiod
			kloop_start = chnget:k("loop_start")
			kloop_length = chnget:k("loop_length")
			kreset_count += 1
			;kphsperiod = int(random:k(1, 8)) * .25 * sr
		endif
		
		kndx += 1 
	od
	; aphs = (aphs* kloop_length/sr + kloop_start/sr)
	asigl  mincer aphs, kamp, kpitch, 1, ilock, 2048, 10
	chnset k(aphs)*sr, "playhead"

	chnset kloop_start, "cs_loop_start"
	chnset kloop_length, "cs_loop_length"
	chnset kreset_count, "reset_count"
	chnset int(kphs), "cs_phase"

	; if ftchnls(p1) == 1 then
	; 	asigl loscil 0.5, 1, p1, 1, 1
	; 	asigr = asigl
	; elseif ftchnls(p1) == 2 then
	;     asigl, asigr loscil 0.5, 1, p1, 1, 0
	; endif

	; asigr diskin2 "myFile.WAV", 1
	asigr = asigl
	outs asigr, asigl
endin

</CsInstruments>
<CsScore>
; f0 z
</CsScore>
</CsoundSynthesizer>
