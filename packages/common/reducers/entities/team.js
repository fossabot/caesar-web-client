import { createReducer } from '@caesar/common/utils/reducer';
import {
  FETCH_TEAMS_REQUEST,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_FAILURE,
  FETCH_TEAM_REQUEST,
  FETCH_TEAM_SUCCESS,
  FETCH_TEAM_FAILURE,
  CREATE_TEAM_REQUEST,
  CREATE_TEAM_SUCCESS,
  CREATE_TEAM_FAILURE,
  REMOVE_TEAM_REQUEST,
  REMOVE_TEAM_SUCCESS,
  REMOVE_TEAM_FAILURE,
  UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  UPDATE_TEAM_MEMBER_ROLE_SUCCESS,
  UPDATE_TEAM_MEMBER_ROLE_FAILURE,
  ADD_TEAM_MEMBERS_BATCH_REQUEST,
  ADD_TEAM_MEMBERS_BATCH_SUCCESS,
  ADD_TEAM_MEMBERS_BATCH_FAILURE,
  REMOVE_TEAM_MEMBER_REQUEST,
  REMOVE_TEAM_MEMBER_SUCCESS,
  REMOVE_TEAM_MEMBER_FAILURE,
  ADD_TEAMS_BATCH,
  ADD_TEAM_MEMBER,
} from '@caesar/common/actions/entities/team';

const initialState = {
  isLoading: true,
  isError: false,
  byId: {},
};

export default createReducer(initialState, {
  [FETCH_TEAMS_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_TEAMS_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: {
        ...state.byId,
        ...payload.teamsById,
      },
    };
  },
  [FETCH_TEAMS_FAILURE](state) {
    return { ...state, isLoading: false, isError: true };
  },
  [FETCH_TEAM_REQUEST](state) {
    return { ...state, isLoading: true };
  },
  [FETCH_TEAM_SUCCESS](state, { payload }) {
    return {
      ...state,
      isLoading: false,
      isError: false,
      byId: {
        ...state.byId,
        [payload.team.id]: {
          ...(state.byId[payload.team.id] || {}),
          ...payload.team,
        },
      },
    };
  },
  [FETCH_TEAM_FAILURE](state) {
    return {
      ...state,
      isLoading: false,
      isError: true,
    };
  },
  [CREATE_TEAM_REQUEST](state) {
    return state;
  },
  [CREATE_TEAM_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.team.id]: payload.team,
      },
    };
  },
  [CREATE_TEAM_FAILURE](state) {
    return state;
  },
  [REMOVE_TEAM_REQUEST](state) {
    return state;
  },
  [REMOVE_TEAM_SUCCESS](state, { payload }) {
    const { [payload.teamId]: team, ...rest } = state.byId;

    return {
      ...state,
      byId: rest,
    };
  },
  [REMOVE_TEAM_FAILURE](state) {
    return state;
  },
  [UPDATE_TEAM_MEMBER_ROLE_REQUEST](state) {
    return state;
  },
  [UPDATE_TEAM_MEMBER_ROLE_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          users: state.byId[payload.teamId].users.map(user =>
            user.id === payload.userId ? { ...user, role: payload.role } : user,
          ),
        },
      },
    };
  },
  [UPDATE_TEAM_MEMBER_ROLE_FAILURE](state) {
    return state;
  },
  [ADD_TEAM_MEMBERS_BATCH_REQUEST](state) {
    return state;
  },
  [ADD_TEAM_MEMBERS_BATCH_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          users: [
            ...state.byId[payload.teamId].users,
            ...payload.members.map(({ id, role }) => ({ id, role })),
          ],
        },
      },
    };
  },
  [ADD_TEAM_MEMBERS_BATCH_FAILURE](state) {
    return state;
  },
  [REMOVE_TEAM_MEMBER_REQUEST](state) {
    return state;
  },
  [REMOVE_TEAM_MEMBER_SUCCESS](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          users: state.byId[payload.teamId].users.filter(
            ({ id }) => id !== payload.userId,
          ),
        },
      },
    };
  },
  [REMOVE_TEAM_MEMBER_FAILURE](state) {
    return state;
  },
  [ADD_TEAMS_BATCH](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...Object.keys(payload.teamsById).reduce(
          (accumulator, teamId) => ({
            ...accumulator,
            [teamId]: {
              ...(state.byId[teamId] || {}),
              ...payload.teamsById[teamId],
            },
          }),
          {},
        ),
      },
    };
  },
  [ADD_TEAM_MEMBER](state, { payload }) {
    return {
      ...state,
      byId: {
        ...state.byId,
        [payload.teamId]: {
          ...state.byId[payload.teamId],
          users: [
            ...state.byId[payload.teamId].users,
            { id: payload.userId, role: payload.role },
          ],
        },
      },
    };
  },
});
