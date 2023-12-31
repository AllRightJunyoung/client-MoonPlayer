import { useCallback, useMemo, useRef } from 'react';

import ReactPlayer from 'react-player/lazy';
import type { MusicItemType } from 'Music/types';
import { selectPrevMusic, selectNextMusic, shuffleMusic } from 'Music/utils/player';
import { useAppSelector, useAppDispatch } from 'shared/hooks/useReduxStore';
import {
  handleRepeatMusicModule,
  handlePlayMusicModule,
  handleVolumeMusicModule,
  handleProgressBarModule,
  handlePlaySelectedMusicModlue,
  handleNextPlayMusic,
  handlePrevPlayMusic,
  handleShuffleMusics,
  handleSetMusic,
} from 'Music/store/feature/PlayerSlice';
import useMusicPageUIController from './useMusicPageUIController';
import { PlayerControlModule_INIT } from 'Music/constants/player';

const usePlayerController = () => {
  const dispatch = useAppDispatch();
  const playerRef = useRef<ReactPlayer>(null);
  const playerSelector = useAppSelector((state) => state.music.player);
  const playerModuleSelector = useAppSelector((state) => state.music.player.playerControlModuleState);
  const { onhandleOpenMusicFooterUI } = useMusicPageUIController();

  // 현재 재생시간
  const currentTime =
    playerRef && playerRef.current ? Math.floor(playerRef.current.getCurrentTime()).toString() : '00:00';
  // 영상 총길이
  const endTime = playerRef && playerRef.current ? Math.floor(playerRef.current.getDuration()).toString() : '00:00';
  const volume = parseFloat((playerModuleSelector.volume / 100).toString());

  useMemo(() => {
    if (!playerSelector.playingMusic.id) return;
    dispatch(
      handlePlaySelectedMusicModlue({
        ...playerModuleSelector,
        playing: true,
        music: playerSelector.playingMusic,
        currentTime,
        endTime,
      })
    );
  }, [playerSelector.playingMusic.id]);

  const onRepeatMusic = useCallback(() => {
    dispatch(handleRepeatMusicModule({ ...playerModuleSelector, isrepeat: !playerModuleSelector.isrepeat }));
  }, [playerModuleSelector]);

  const onPlayMusic = useCallback(() => {
    dispatch(handlePlayMusicModule({ ...playerModuleSelector, playing: !playerModuleSelector.playing }));
  }, [playerModuleSelector]);

  const onVolumeControl = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(handleVolumeMusicModule({ ...playerModuleSelector, volume: +event.currentTarget.value }));
  };

  const progressBarControl = useCallback(() => {
    dispatch(handleProgressBarModule({ ...playerModuleSelector, currentTime, endTime }));
  }, [playerModuleSelector]);

  const onSelectPrevMusic = useCallback(() => {
    dispatch(handlePrevPlayMusic(selectPrevMusic(playerSelector.list, playerSelector.playingMusic)));
  }, [playerModuleSelector]);

  const onSelectNextMusic = useCallback(() => {
    dispatch(handleNextPlayMusic(selectNextMusic(playerSelector.list, playerSelector.playingMusic)));
  }, [playerModuleSelector]);

  const onShuffleMusics = useCallback(() => {
    dispatch(handleShuffleMusics(shuffleMusic(playerSelector.list)));
  }, [playerModuleSelector]);

  const handleEndedMusicHandler = useCallback(() => onSelectNextMusic(), []);

  const onSetMusic = useCallback(
    (music: MusicItemType) => {
      dispatch(handleSetMusic(music));
      onhandleOpenMusicFooterUI(true);
    },
    [playerModuleSelector]
  );

  const resetPlayerModule = useCallback(() => {
    dispatch(handlePlaySelectedMusicModlue(PlayerControlModule_INIT));
  }, [playerModuleSelector]);

  const musicPlayer = (
    <ReactPlayer
      ref={playerRef}
      style={{ opacity: 0 }}
      width="1px"
      height="1px"
      volume={volume}
      url={playerModuleSelector.music && playerModuleSelector.music.source_url}
      playing={playerModuleSelector.playing}
      loop={playerModuleSelector.isrepeat}
      onEnded={handleEndedMusicHandler}
      onProgress={progressBarControl}
    ></ReactPlayer>
  );
  return {
    musicPlayer,
    playerModuleSelector,
    resetPlayerModule,
    onRepeatMusic,
    onPlayMusic,
    onVolumeControl,
    onShuffleMusics,
    onSelectPrevMusic,
    onSelectNextMusic,
    onSetMusic,
  };
};

export default usePlayerController;
