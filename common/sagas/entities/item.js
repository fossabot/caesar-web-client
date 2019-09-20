import { put, call, takeLatest, select, fork, take } from 'redux-saga/effects';
import deepequal from 'fast-deep-equal';
import {
  ACCEPT_ITEM_UPDATE_REQUEST,
  CREATE_ITEM_REQUEST,
  CREATE_ITEMS_BATCH_REQUEST,
  EDIT_ITEM_REQUEST,
  UPDATE_ITEM_REQUEST,
  MOVE_ITEM_REQUEST,
  MOVE_ITEMS_BATCH_REQUEST,
  REJECT_ITEM_UPDATE_REQUEST,
  REMOVE_ITEM_REQUEST,
  REMOVE_ITEMS_BATCH_REQUEST,
  TOGGLE_ITEM_TO_FAVORITE_REQUEST,
  CREATE_ANONYMOUS_LINK_REQUEST,
  REMOVE_ANONYMOUS_LINK_REQUEST,
  SHARE_ITEM_BATCH_REQUEST,
  REMOVE_SHARE_REQUEST,
  acceptItemUpdateSuccess,
  acceptItemUpdateFailure,
  createItemSuccess,
  createItemFailure,
  createItemsBatchSuccess,
  createItemsBatchFailure,
  editItemFailure,
  updateItemSuccess,
  updateItemFailure,
  moveItemSuccess,
  moveItemFailure,
  moveItemsBatchSuccess,
  moveItemsBatchFailure,
  rejectItemUpdateSuccess,
  rejectItemUpdateFailure,
  removeItemSuccess,
  removeItemFailure,
  removeItemsBatchSuccess,
  removeItemsBatchFailure,
  toggleItemToFavoriteSuccess,
  toggleItemToFavoriteFailure,
  createAnonymousLinkSuccess,
  createAnonymousLinkFailure,
  removeAnonymousLinkSuccess,
  removeAnonymousLinkFailure,
  removeChildItemFromItem,
  shareItemBatchSuccess,
  shareItemBatchFailure,
  removeShareSuccess,
  removeShareFailure,
  addChildItemsBatchToItems,
} from 'common/actions/entities/item';
import {
  addItemToList,
  addItemsBatchToList,
  moveItemToList,
  moveItemsBatchToList,
  removeItemFromList,
  removeItemsBatchFromList,
  toggleItemToFavoriteList,
} from 'common/actions/entities/list';
import {
  CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT,
  removeChildItemsBatch,
} from 'common/actions/entities/childItem';
import {
  createChildItemBatchSaga,
  updateChildItemsBatchSaga,
} from 'common/sagas/entities/childItem';
import {
  prepareUsersForSharing,
  getItemUserPairs,
} from 'common/sagas/common/share';
import { inviteNewMemberBatchSaga } from 'common/sagas/common/invite';
import {
  setWorkInProgressItem,
  updateWorkInProgressItem,
} from 'common/actions/workflow';
import {
  workInProgressItemSelector,
  workInProgressItemIdsSelector,
} from 'common/selectors/workflow';
import {
  favoritesSelector,
  listSelector,
} from 'common/selectors/entities/list';
import {
  itemsBatchSelector,
  itemSelector,
} from 'common/selectors/entities/item';
import { membersBatchSelector } from 'common/selectors/entities/member';
import {
  keyPairSelector,
  masterPasswordSelector,
  userDataSelector,
} from 'common/selectors/user';
import {
  teamSelector,
  teamsMembersSelector,
} from 'common/selectors/entities/team';
import {
  acceptUpdateItem,
  patchChildItem,
  postCreateChildItem,
  postCreateItem,
  postCreateItemsBatch,
  rejectUpdateItem,
  deleteChildItem,
  removeItem,
  removeItemsBatch,
  toggleFavorite,
  updateItem,
  updateMoveItem,
  updateMoveItemsBatch,
} from 'common/api';
import {
  decryptItem,
  encryptItem,
  encryptItemsBatch,
  generateAnonymousEmail,
  getPrivateKeyObj,
} from 'common/utils/cipherUtils';
import { objectToBase64 } from 'common/utils/base64';
import {
  ROLE_ANONYMOUS_USER,
  ITEM_REVIEW_MODE,
  PERMISSION_READ,
  SHARE_TYPE,
  ITEM_ENTITY_TYPE,
} from 'common/constants';
import { generateSharingUrl } from 'common/utils/sharing';
import { createMemberSaga } from './member';

export function* removeItemSaga({ payload: { itemId, listId } }) {
  try {
    const item = yield select(itemSelector, { itemId });

    yield call(removeItem, itemId);

    yield put(removeItemFromList(itemId, listId));
    yield put(removeItemSuccess(itemId, listId));
    yield put(removeChildItemsBatch(item.invited));

    if (item.favorite) {
      const favoriteList = yield select(favoritesSelector);
      yield put(removeItemFromList(itemId, favoriteList.id));
    }

    yield put(setWorkInProgressItem(null));
  } catch (error) {
    console.log(error);
    yield put(removeItemFailure());
  }
}

export function* removeItemsBatchSaga({ payload: { listId } }) {
  try {
    const workInProgressItemIds = yield select(workInProgressItemIdsSelector);

    yield call(
      removeItemsBatch,
      workInProgressItemIds.map(id => `items[]=${id}`).join('&'),
    );
    yield put(setWorkInProgressItem(null));
    yield put(removeItemsBatchSuccess(workInProgressItemIds, listId));
    yield put(removeItemsBatchFromList(workInProgressItemIds, listId));
  } catch (error) {
    console.log(error);
    yield put(removeItemsBatchFailure());
  }
}

export function* moveItemSaga({ payload: { listId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(updateMoveItem, workInProgressItem.id, { listId });
    yield put(
      moveItemSuccess(workInProgressItem.id, workInProgressItem.listId, listId),
    );
    yield put(
      moveItemToList(workInProgressItem.id, workInProgressItem.listId, listId),
    );
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(moveItemFailure());
  }
}

export function* moveItemsBatchSaga({ payload: { oldListId, newListId } }) {
  try {
    const workInProgressItemIds = yield select(workInProgressItemIdsSelector);

    if (workInProgressItemIds.length > 0) {
      yield call(
        updateMoveItemsBatch,
        { items: workInProgressItemIds },
        newListId,
      );
      yield put(
        moveItemsBatchSuccess(workInProgressItemIds, oldListId, newListId),
      );
      yield put(
        moveItemsBatchToList(workInProgressItemIds, oldListId, newListId),
      );
    }
  } catch (error) {
    console.log(error);
    yield put(moveItemsBatchFailure());
  }
}

export function* createItemSaga({
  payload: { item },
  meta: { setSubmitting },
}) {
  try {
    const { listId, attachments, type, ...data } = item;

    const list = yield select(listSelector, { listId });
    const keyPair = yield select(keyPairSelector);
    const user = yield select(userDataSelector);

    const encryptedItem = yield call(
      encryptItem,
      { attachments, ...data },
      keyPair.publicKey,
    );

    const {
      data: { id: itemId, lastUpdated },
    } = yield call(postCreateItem, {
      listId,
      type,
      secret: encryptedItem,
    });

    const newItem = {
      id: itemId,
      listId,
      lastUpdated,
      type,
      favorite: false,
      invited: [],
      shared: null,
      tags: [],
      teamId: list.teamId,
      ownerId: user.id,
      secret: encryptedItem,
      data: { attachments, ...data },
      __type: ITEM_ENTITY_TYPE,
    };

    yield put(createItemSuccess(newItem));
    yield put(addItemToList(newItem));
    yield put(updateWorkInProgressItem(itemId, ITEM_REVIEW_MODE));

    if (list.teamId) {
      const team = yield select(teamSelector, { teamId: list.teamId });
      const memberIds = team.users.map(({ id }) => id);
      const members = yield select(membersBatchSelector, { memberIds });

      const itemUserPairs = members
        .filter(({ id }) => id !== user.id)
        .map(({ id, publicKey }) => ({
          item: { id: itemId, data: newItem.data },
          user: { id, publicKey, teamId: list.teamId },
        }));

      yield fork(createChildItemBatchSaga, {
        payload: { itemUserPairs },
      });

      const {
        payload: { childItems },
      } = yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

      const shares = childItems.reduce(
        // eslint-disable-next-line
        (accumulator, item) => [
          ...accumulator,
          {
            itemId: item.originalItemId,
            childItemIds: item.items.map(({ id }) => id),
          },
        ],
        [],
      );

      yield put(addChildItemsBatchToItems(shares));
      yield put(updateWorkInProgressItem());
    }
  } catch (error) {
    console.log(error);
    yield put(createItemFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* createItemsBatchSaga({
  payload: { items, listId },
  meta: { setSubmitting },
}) {
  try {
    const keyPair = yield select(keyPairSelector);
    const user = yield select(userDataSelector);

    const preparedForEncryptingItems = items.map(
      ({ attachments, type, ...data }) => ({
        attachments,
        ...data,
      }),
    );

    const encryptedItems = yield call(
      encryptItemsBatch,
      preparedForEncryptingItems,
      keyPair.publicKey,
    );

    const preparedForRequestItems = items.map(({ type }, index) => ({
      type,
      listId,
      secret: encryptedItems[index],
    }));

    const { data } = yield call(postCreateItemsBatch, {
      items: preparedForRequestItems,
    });

    const preparedForStoreItems = data.map((item, index) => ({
      id: item.id,
      listId,
      lastUpdated: item.lastUpdated,
      favorite: false,
      invited: [],
      shared: null,
      tags: [],
      owner: user.id,
      data: preparedForEncryptingItems[index],
      type: items[index].type,
    }));

    yield put(createItemsBatchSuccess(preparedForStoreItems));
    yield put(addItemsBatchToList(data.map(({ id }) => id), listId));
  } catch (error) {
    console.log(error);
    yield put(createItemsBatchFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* updateItemSaga({ payload: { item } }) {
  try {
    const keyPair = yield select(keyPairSelector);

    const encryptedItemSecret = yield call(
      encryptItem,
      item.data,
      keyPair.publicKey,
    );

    yield call(updateItem, item.id, { item: { secret: encryptedItemSecret } });

    yield put(updateItemSuccess({ ...item, secret: encryptedItemSecret }));
  } catch (error) {
    console.log(error);
    yield put(updateItemFailure());
  }
}

export function* editItemSaga({ payload: { item }, meta: { setSubmitting } }) {
  try {
    const { listId, attachments, type, ...data } = item;

    const workInProgressItem = yield select(workInProgressItemSelector);
    const originalItem = yield select(itemSelector, {
      itemId: workInProgressItem.id,
    });

    const editedItemData = {
      attachments,
      ...data,
    };

    const editedItem = {
      ...originalItem,
      listId,
      data: editedItemData,
    };

    const isDataChanged = !deepequal(workInProgressItem.data, editedItemData);
    const isListIdChanged = listId !== workInProgressItem.listId;

    if (isListIdChanged) {
      yield call(moveItemSaga, { payload: { listId } });
    }

    if (isDataChanged) {
      yield call(updateItemSaga, { payload: { item: editedItem } });

      if (originalItem.invited.length) {
        yield call(updateChildItemsBatchSaga, {
          payload: { item: editedItem },
        });
      }
    }

    yield put(updateWorkInProgressItem(editedItem.id, ITEM_REVIEW_MODE));
  } catch (error) {
    console.log(error);
    yield put(editItemFailure());
  } finally {
    setSubmitting(false);
  }
}

export function* acceptItemSaga({ payload: { id } }) {
  try {
    const keyPair = yield select(keyPairSelector);
    const masterPassword = yield select(masterPasswordSelector);

    const {
      data: { secret, ...itemData },
    } = yield call(acceptUpdateItem, id);

    const privateKeyObj = yield call(
      getPrivateKeyObj,
      keyPair.privateKey,
      masterPassword,
    );

    const decryptedItemSecret = yield decryptItem(secret, privateKeyObj);

    const newItem = {
      ...itemData,
      secret,
      data: decryptedItemSecret,
      invited: itemData.invited.map(({ id: childId }) => childId),
    };

    yield put(acceptItemUpdateSuccess(newItem));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.error(error);
    yield put(acceptItemUpdateFailure(error));
  }
}

export function* rejectItemSaga({ payload: { id } }) {
  try {
    yield call(rejectUpdateItem, id);

    yield put(rejectItemUpdateSuccess(id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(rejectItemUpdateFailure(error));
  }
}

export function* toggleItemToFavoriteSaga({ payload: { itemId } }) {
  try {
    const favoritesList = yield select(favoritesSelector);

    const {
      data: { favorite: isFavorite },
    } = yield call(toggleFavorite, itemId);

    yield put(
      toggleItemToFavoriteSuccess(itemId, favoritesList.id, isFavorite),
    );
    yield put(toggleItemToFavoriteList(itemId, favoritesList.id, isFavorite));
    yield put(updateWorkInProgressItem(itemId));
  } catch (error) {
    console.log(error);
    yield put(toggleItemToFavoriteFailure());
  }
}

export function* createAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    const email = generateAnonymousEmail();

    const {
      id: userId,
      name,
      password,
      masterPassword,
      publicKey,
    } = yield call(createMemberSaga, {
      payload: {
        email,
        role: ROLE_ANONYMOUS_USER,
      },
    });

    const encryptedSecret = yield call(
      encryptItem,
      workInProgressItem.data,
      publicKey,
    );

    const {
      data: { items },
    } = yield call(postCreateChildItem, workInProgressItem.id, {
      items: [
        {
          userId,
          secret: encryptedSecret,
          cause: SHARE_TYPE,
          access: PERMISSION_READ,
        },
      ],
    });

    const link = generateSharingUrl(
      items[0].id,
      objectToBase64({
        e: email,
        p: password,
        mp: masterPassword,
      }),
    );

    yield call(patchChildItem, workInProgressItem.id, {
      items: [{ userId, link, secret: encryptedSecret }],
    });

    const share = {
      id: items[0].id,
      userId,
      email,
      name,
      link,
      publicKey,
      isAccepted: false,
      roles: [ROLE_ANONYMOUS_USER],
    };

    yield put(createAnonymousLinkSuccess(workInProgressItem.id, share));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(createAnonymousLinkFailure());
  }
}

export function* removeAnonymousLinkSaga() {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, workInProgressItem.shared.id);

    yield put(removeAnonymousLinkSuccess(workInProgressItem.id));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(removeAnonymousLinkFailure());
  }
}

export function* shareItemBatchSaga({
  payload: { itemIds, members, teamIds },
}) {
  try {
    const user = yield select(userDataSelector);
    const items = yield select(itemsBatchSelector, { itemIds });

    const preparedMembers = yield call(prepareUsersForSharing, members);

    const newMembers = preparedMembers.filter(({ isNew }) => isNew);

    const directMembers = preparedMembers.map(member => ({
      ...member,
      teamId: null,
    }));

    const teamsMembers = yield select(teamsMembersSelector, { teamIds });

    const allMembers = [...directMembers, ...teamsMembers].filter(
      member => member.id !== user.id,
    );

    const itemUserPairs = yield call(getItemUserPairs, {
      items,
      members: allMembers,
    });

    if (newMembers.length > 0) {
      yield fork(inviteNewMemberBatchSaga, {
        payload: { members: newMembers },
      });
    }

    yield fork(createChildItemBatchSaga, { payload: { itemUserPairs } });

    const {
      payload: { childItems },
    } = yield take(CREATE_CHILD_ITEM_BATCH_FINISHED_EVENT);

    const shares = childItems.reduce(
      (accumulator, item) => [
        ...accumulator,
        {
          itemId: item.originalItemId,
          childItemIds: item.items.map(({ id }) => id),
        },
      ],
      [],
    );

    yield put(shareItemBatchSuccess(shares));

    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(shareItemBatchFailure());
  }
}

export function* removeShareSaga({ payload: { shareId } }) {
  try {
    const workInProgressItem = yield select(workInProgressItemSelector);

    yield call(deleteChildItem, shareId);

    yield put(removeChildItemFromItem(workInProgressItem.id, shareId));
    yield put(removeShareSuccess(workInProgressItem.id, shareId));
    yield put(updateWorkInProgressItem());
  } catch (error) {
    console.log(error);
    yield put(removeShareFailure());
  }
}

export default function* itemSagas() {
  yield takeLatest(REMOVE_ITEM_REQUEST, removeItemSaga);
  yield takeLatest(REMOVE_ITEMS_BATCH_REQUEST, removeItemsBatchSaga);
  yield takeLatest(MOVE_ITEM_REQUEST, moveItemSaga);
  yield takeLatest(MOVE_ITEMS_BATCH_REQUEST, moveItemsBatchSaga);
  yield takeLatest(CREATE_ITEM_REQUEST, createItemSaga);
  yield takeLatest(CREATE_ITEMS_BATCH_REQUEST, createItemsBatchSaga);
  yield takeLatest(EDIT_ITEM_REQUEST, editItemSaga);
  yield takeLatest(UPDATE_ITEM_REQUEST, updateItemSaga);
  yield takeLatest(ACCEPT_ITEM_UPDATE_REQUEST, acceptItemSaga);
  yield takeLatest(REJECT_ITEM_UPDATE_REQUEST, rejectItemSaga);
  yield takeLatest(TOGGLE_ITEM_TO_FAVORITE_REQUEST, toggleItemToFavoriteSaga);
  yield takeLatest(CREATE_ANONYMOUS_LINK_REQUEST, createAnonymousLinkSaga);
  yield takeLatest(REMOVE_ANONYMOUS_LINK_REQUEST, removeAnonymousLinkSaga);
  yield takeLatest(SHARE_ITEM_BATCH_REQUEST, shareItemBatchSaga);
  yield takeLatest(REMOVE_SHARE_REQUEST, removeShareSaga);
}