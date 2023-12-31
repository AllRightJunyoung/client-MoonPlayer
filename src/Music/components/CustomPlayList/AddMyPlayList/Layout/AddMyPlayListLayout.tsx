import * as Styled from './AddMyPlayListLayout.styled';

import { useAppSelector, useAppDispatch } from 'shared/hooks/useReduxStore';

import { Flex, IconButton } from 'shared/components';
import { useDialog } from 'shared/hooks';
import { memo, useCallback, useRef } from 'react';
import { handleAddPlayListInput } from 'Music/store/feature/MusicUISlice';
import { myPlayListInputValidation, myPlayListLengthValidation } from 'Music/utils/validation';
import CustomPlayListHeader from '../../CustomPlayListHeader';
import MusicItem from 'Music/components/MusicItem';

export const AddMyPlayListLayout = () => {
  const dispatch = useAppDispatch();
  const playerList = useAppSelector((state) => state.music.player.list);
  const { showConfirmMessage, showAlarmMessage } = useDialog();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSaveButton = useCallback(() => {
    if (!inputRef.current?.value) return;
    const inputValue = inputRef.current.value;
    if (!myPlayListLengthValidation(playerList)) {
      showAlarmMessage('재생목록이 존재하지 않습니다.');
      return;
    }

    if (!myPlayListInputValidation(inputValue)) return;

    dispatch(handleAddPlayListInput(inputValue));
    showConfirmMessage('PlayListSave');
  }, [inputRef]);

  const currentPlayerMusics =
    playerList.length > 0 ? (
      playerList.map(({ name, img_url }, index) => <MusicItem name={name} url={img_url} key={index} order={++index} />)
    ) : (
      <Styled.EmptyText>재생 목록이 비어있습니다.</Styled.EmptyText>
    );

  return (
    <>
      <CustomPlayListHeader title="MY P L A Y L I S T ADD" />
      <Styled.Layout direction="column" justifyContent="center">
        <Flex direction="row" justifyContent="space-between" alignItems="center">
          <Styled.InputBox direction="row" alignItems="center" gap="15px">
            <Styled.Input placeholder="30자 이내에서 입력해주세요!" ref={inputRef} />
            <IconButton name="save" size="2x" color="white" onClick={handleSaveButton}></IconButton>
          </Styled.InputBox>
        </Flex>
        <Styled.Title>재생목록</Styled.Title>
        <Styled.PlayListBox>{currentPlayerMusics}</Styled.PlayListBox>
      </Styled.Layout>
    </>
  );
};
export default memo(AddMyPlayListLayout);
