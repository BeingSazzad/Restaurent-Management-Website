import { StaffUser } from '../../types/common.types';
import { INITIAL_STAFF_USERS } from '../../lib/constants';

export const usersApi = {
  getStaffMembers: async (): Promise<StaffUser[]> => {
    return INITIAL_STAFF_USERS;
  },
  updateStaffRole: async (userId: string, role: StaffUser['role']): Promise<StaffUser | undefined> => {
    const user = INITIAL_STAFF_USERS.find((u) => u.id === userId);
    if (user) user.role = role;
    return user;
  },
};
