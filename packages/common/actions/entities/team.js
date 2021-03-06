export const FETCH_TEAMS_REQUEST = '@team/FETCH_TEAMS_REQUEST';
export const FETCH_TEAMS_SUCCESS = '@team/FETCH_TEAMS_SUCCESS';
export const FETCH_TEAMS_FAILURE = '@team/FETCH_TEAMS_FAILURE';

export const FETCH_TEAM_REQUEST = '@team/FETCH_TEAM_REQUEST';
export const FETCH_TEAM_SUCCESS = '@team/FETCH_TEAM_SUCCESS';
export const FETCH_TEAM_FAILURE = '@team/FETCH_TEAM_FAILURE';

export const CREATE_TEAM_REQUEST = '@team/CREATE_TEAM_REQUEST';
export const CREATE_TEAM_SUCCESS = '@team/CREATE_TEAM_SUCCESS';
export const CREATE_TEAM_FAILURE = '@team/CREATE_TEAM_FAILURE';

export const REMOVE_TEAM_REQUEST = '@team/REMOVE_TEAM_REQUEST';
export const REMOVE_TEAM_SUCCESS = '@team/REMOVE_TEAM_SUCCESS';
export const REMOVE_TEAM_FAILURE = '@team/REMOVE_TEAM_FAILURE';

export const UPDATE_TEAM_MEMBER_ROLE_REQUEST =
  '@team/UPDATE_TEAM_MEMBER_ROLE_REQUEST';
export const UPDATE_TEAM_MEMBER_ROLE_SUCCESS =
  '@team/UPDATE_TEAM_MEMBER_ROLE_SUCCESS';
export const UPDATE_TEAM_MEMBER_ROLE_FAILURE =
  '@team/UPDATE_TEAM_MEMBER_ROLE_FAILURE';

export const ADD_TEAM_MEMBERS_BATCH_REQUEST =
  '@team/ADD_TEAM_MEMBERS_BATCH_REQUEST';
export const ADD_TEAM_MEMBERS_BATCH_SUCCESS =
  '@team/ADD_TEAM_MEMBERS_BATCH_SUCCESS';
export const ADD_TEAM_MEMBERS_BATCH_FAILURE =
  '@team/ADD_TEAM_MEMBERS_BATCH_FAILURE';

export const REMOVE_TEAM_MEMBER_REQUEST = '@team/REMOVE_TEAM_MEMBER_REQUEST';
export const REMOVE_TEAM_MEMBER_SUCCESS = '@team/REMOVE_TEAM_MEMBER_SUCCESS';
export const REMOVE_TEAM_MEMBER_FAILURE = '@team/REMOVE_TEAM_MEMBER_FAILURE';

export const ADD_TEAMS_BATCH = '@team/ADD_TEAMS_BATCH';
export const ADD_TEAM_MEMBER = '@team/ADD_TEAM_MEMBER';

export const fetchTeamsRequest = () => ({
  type: FETCH_TEAMS_REQUEST,
});

export const fetchTeamsSuccess = teamsById => ({
  type: FETCH_TEAMS_SUCCESS,
  payload: {
    teamsById,
  },
});

export const fetchTeamsFailure = () => ({
  type: FETCH_TEAMS_FAILURE,
});

export const fetchTeamRequest = teamId => ({
  type: FETCH_TEAM_REQUEST,
  payload: {
    teamId,
  },
});

export const fetchTeamSuccess = team => ({
  type: FETCH_TEAM_SUCCESS,
  payload: {
    team,
  },
});

export const fetchTeamFailure = () => ({
  type: FETCH_TEAM_FAILURE,
});

export const createTeamRequest = (title, icon) => ({
  type: CREATE_TEAM_REQUEST,
  payload: {
    title,
    icon,
  },
});

export const createTeamSuccess = team => ({
  type: CREATE_TEAM_SUCCESS,
  payload: {
    team,
  },
});

export const createTeamFailure = () => ({
  type: CREATE_TEAM_FAILURE,
});

export const removeTeamRequest = teamId => ({
  type: REMOVE_TEAM_REQUEST,
  payload: {
    teamId,
  },
});

export const removeTeamSuccess = teamId => ({
  type: REMOVE_TEAM_SUCCESS,
  payload: {
    teamId,
  },
});

export const removeTeamFailure = () => ({
  type: REMOVE_TEAM_FAILURE,
});

export const updateTeamMemberRoleRequest = (teamId, userId, role) => ({
  type: UPDATE_TEAM_MEMBER_ROLE_REQUEST,
  payload: {
    teamId,
    userId,
    role,
  },
});

export const updateTeamMemberRoleSuccess = (teamId, userId, role) => ({
  type: UPDATE_TEAM_MEMBER_ROLE_SUCCESS,
  payload: {
    teamId,
    userId,
    role,
  },
});

export const updateTeamMemberRoleFailure = () => ({
  type: UPDATE_TEAM_MEMBER_ROLE_FAILURE,
});

export const addTeamMembersBatchRequest = (teamId, members) => ({
  type: ADD_TEAM_MEMBERS_BATCH_REQUEST,
  payload: {
    teamId,
    members,
  },
});

export const addTeamMembersBatchSuccess = (teamId, members) => ({
  type: ADD_TEAM_MEMBERS_BATCH_SUCCESS,
  payload: {
    teamId,
    members,
  },
});

export const addTeamMembersBatchFailure = () => ({
  type: ADD_TEAM_MEMBERS_BATCH_FAILURE,
});

export const removeTeamMemberRequest = (teamId, userId) => ({
  type: REMOVE_TEAM_MEMBER_REQUEST,
  payload: {
    teamId,
    userId,
  },
});

export const removeTeamMemberSuccess = (teamId, userId) => ({
  type: REMOVE_TEAM_MEMBER_SUCCESS,
  payload: {
    teamId,
    userId,
  },
});

export const removeTeamMemberFailure = () => ({
  type: REMOVE_TEAM_MEMBER_FAILURE,
});

export const addTeamsBatch = teamsById => ({
  type: ADD_TEAMS_BATCH,
  payload: {
    teamsById,
  },
});

export const addTeamMember = (teamId, userId, role) => ({
  type: ADD_TEAM_MEMBER,
  payload: {
    teamId,
    userId,
    role,
  },
});
