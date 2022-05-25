$(function()
{
    var playerTrack = $("#player-track"), bgArtwork = $('#bg-artwork'), bgArtworkUrl, albumName = $('#album-name'), trackName = $('#track-name'), albumArt = $('#album-art'), sArea = $('#s-area'), seekBar = $('#seek-bar'), trackTime = $('#track-time'), insTime = $('#ins-time'), sHover = $('#s-hover'), playPauseButton = $("#play-pause-button"),  i = playPauseButton.find('i'), tProgress = $('#current-time'), tTime = $('#track-length'), seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0, buffInterval = null, tFlag = false, albums = ['DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion','DJ Eddie Motion'], trackNames = ['Mix - 1','Mix - 2','Mix - 3','Mix - 4','Mix - 5','Mix - 6','Mix - 7','Mix - 8','Mix - 9 SOME LATIN','Mix-10 Happy Hour 70s'],'Mix-11 Happy Hour 70-80s'], albumArtworks = ['_1','_2','_3','_4','_5','_6','_7','_8','_9','_10','_11'], trackUrl = ['https://stream10.mixcloud.com/secure/c/m4a/64/3/9/c/2/5e68-bea5-44e5-9f21-94039276f5b1.m4a?sig=zsD0AGVr8-WakHVHLsoDOQ','https://stream10.mixcloud.com/secure/c/m4a/64/1/5/3/d/7fda-6804-4636-bdae-bc322f331b24.m4a?sig=5h_BEGmrkaZ5qVvgFgXOvw','https://raw.githubusercontent.com/djeddieMotion/Medley/main/audio/2.mp3','https://raw.githubusercontent.com/djeddieMotion/Medley/main/audio/3.mp3','https://raw.githubusercontent.com/djeddieMotion/Medley/main/audio/4.mp3','https://stream1.mixcloud.com/secure/c/m4a/64/6/8/c/4/2db9-8fc5-454c-b937-17b12f81fe54.m4a?sig=M2A3BauHx6FirYe3e-zWHw','https://stream14.mixcloud.com/secure/c/m4a/64/f/2/f/e/9419-2299-45e2-882a-66a23c3936e0.m4a?sig=-9o4Gmnxt9n_rhOcc-WCFA','https://stream14.mixcloud.com/secure/c/m4a/64/e/4/d/6/db9b-f6c3-49ee-bb11-ac5dc7f7be27.m4a?sig=-mssmOJJo8BluiYCqKhJ2A','https://stream8.mixcloud.com/secure/c/m4a/64/1/b/6/f/b96d-9667-473c-a62b-0ac4afb40e99.m4a?sig=lkdgUg2arlkAi2Ab0CrGpA','https://stream6.mixcloud.com/secure/c/m4a/64/9/7/1/d/2b0b-45ed-44c1-9e1d-49857bd43ac2.m4a?sig=m1XHc1vSMstcN6CerGysFw','https://stream7.mixcloud.com/secure/c/m4a/64/7/b/2/d/e525-3dfb-4534-9791-98917a4810dd.m4a?sig=KwZGqrKd1sZWoml3wuREhQ'], playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;



    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
                audio.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','fas fa-play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < albumArtworks.length) )
        {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');

            currAlbum = albums[currIndex];
            currTrackName = trackNames[currIndex];
            currArtwork = albumArtworks[currIndex];

            audio.src = trackUrl[currIndex];
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            albumArt.find('img.active').removeClass('active');
            $('#'+currArtwork).addClass('active');
            
            bgArtworkUrl = $('#'+currArtwork).attr('src');

            bgArtwork.css({'background-image':'url('+bgArtworkUrl+')'});
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
        }
    }

    function initPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	initPlayer();
});
