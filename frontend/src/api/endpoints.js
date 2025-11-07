import axios from './axios';

// Auth API
export const authAPI = {
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
};

// User API
export const userAPI = {
  getAllUsers: () => axios.get('/users'),
  getUserById: (id) => axios.get(`/users/${id}`),
  getCurrentUser: () => axios.get('/users/me'),
  updateUser: (id, userData) => axios.put(`/users/${id}`, userData),
  deleteUser: (id) => axios.delete(`/users/${id}`),
};

// Project API
export const projectAPI = {
  getAllProjects: () => axios.get('/projects'),
  getProjectById: (id) => axios.get(`/projects/${id}`),
  getProjectsByUserId: (userId) => axios.get(`/projects/user/${userId}`),
  createProject: (projectData) => axios.post('/projects', projectData),
  updateProject: (id, projectData) => axios.put(`/projects/${id}`, projectData),
  deleteProject: (id) => axios.delete(`/projects/${id}`),
  addTeamMember: (projectId, userId) => axios.post(`/projects/${projectId}/members/${userId}`),
  removeTeamMember: (projectId, userId) => axios.delete(`/projects/${projectId}/members/${userId}`),
};

// Ticket API
export const ticketAPI = {
  getAllTickets: () => axios.get('/tickets'),
  getTicketById: (id) => axios.get(`/tickets/${id}`),
  getTicketsByProjectId: (projectId) => axios.get(`/tickets/project/${projectId}`),
  getTicketsByUserId: (userId) => axios.get(`/tickets/user/${userId}`),
  createTicket: (ticketData) => axios.post('/tickets', ticketData),
  updateTicket: (id, ticketData) => axios.put(`/tickets/${id}`, ticketData),
  deleteTicket: (id) => axios.delete(`/tickets/${id}`),
  assignDeveloper: (ticketId, userId) => axios.post(`/tickets/${ticketId}/assign/${userId}`),
  unassignDeveloper: (ticketId, userId) => axios.delete(`/tickets/${ticketId}/assign/${userId}`),
};

// Comment API
export const commentAPI = {
  getCommentsByTicketId: (ticketId) => axios.get(`/comments/ticket/${ticketId}`),
  getCommentById: (id) => axios.get(`/comments/${id}`),
  createComment: (commentData) => axios.post('/comments', commentData),
  updateComment: (id, commentData) => axios.put(`/comments/${id}`, commentData),
  deleteComment: (id) => axios.delete(`/comments/${id}`),
};