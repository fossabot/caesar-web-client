export const INIT_WORKFLOW = '@workflow/INIT_WORKFLOW';

export const FINISH_IS_LOADING = '@workflow/FINISH_IS_LOADING';

export const SET_WORK_IN_PROGRESS_ITEM = '@workflow/SET_WORK_IN_PROGRESS_ITEM';
export const UPDATE_WORK_IN_PROGRESS_ITEM =
  '@workflow/UPDATE_WORK_IN_PROGRESS_ITEM';
export const SET_WORK_IN_PROGRESS_ITEM_IDS =
  '@workflow/SET_WORK_IN_PROGRESS_ITEM_IDS';
export const SET_WORK_IN_PROGRESS_LIST_ID =
  '@workflow/SET_WORK_IN_PROGRESS_LIST_ID';

export const RESET_WORK_IN_PROGRESS_ITEM_IDS =
  '@workflow/RESET_WORK_IN_PROGRESS_ITEM_IDS';
export const RESET_WORKFLOW_STORE = '@workflow/RESET_WORKFLOW_STORE';

export const initWorkflow = (withDecryption = true) => ({
  type: INIT_WORKFLOW,
  payload: {
    withDecryption,
  },
});

export const finishIsLoading = () => ({
  type: FINISH_IS_LOADING,
});

export const setWorkInProgressItem = (item, mode) => ({
  type: SET_WORK_IN_PROGRESS_ITEM,
  payload: {
    item,
    mode,
  },
});

export const updateWorkInProgressItem = (itemId, mode) => ({
  type: UPDATE_WORK_IN_PROGRESS_ITEM,
  payload: {
    itemId,
    mode,
  },
});

export const setWorkInProgressItemIds = itemIds => ({
  type: SET_WORK_IN_PROGRESS_ITEM_IDS,
  payload: {
    itemIds,
  },
});

export const setWorkInProgressListId = listId => ({
  type: SET_WORK_IN_PROGRESS_LIST_ID,
  payload: {
    listId,
  },
});

export const resetWorkInProgressItemIds = () => ({
  type: RESET_WORK_IN_PROGRESS_ITEM_IDS,
});

export const resetWorkflowStore = () => ({
  type: RESET_WORKFLOW_STORE,
});
