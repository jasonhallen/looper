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
	kloop_start = chnget:k("loop_start")
	kloop_length = chnget:k("loop_length")
	if kloop_length == 0 then
	  kloop_length = ifile_length
	endif

	; atime line   0, idur, idur*itimescale
	atime phasor (sr*ktimescale)/(kloop_length)
	atime = atime * kloop_length/sr + kloop_start/sr 
	asigl  mincer atime, kamp, kpitch, 1, ilock, 2048, 10
	chnset k(atime)*sr, "playhead"
	
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
