export interface Branch {
  id: number;
  name: string;
  location: string;
  phone: string;
  contactPersonId?: number;
  contactPerson?: User;
}
export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tags?: string[];
  category: "hair" | "skin" | "nails" | "spa";
  isForChildren: boolean;
  estimatedTimeWomen: number;
  estimatedTimeChildren?: number;
}
export interface LoginAccount {
  token: string;
  user: User;
}
export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tags?: string[];
  category: "hair" | "skin" | "nails" | "spa";
  isForChildren: boolean;
  estimatedTimeWomen: number;
  estimatedTimeChildren?: number;
}

export interface Role {
  id: number;
  name: string;
  users?: User[];
}

export interface Branch {
  id: number;
  name: string;
  location: string;
  phone: string;
  contactPersonId?: number;
  contactPerson?: User;
  services?: Service[];
}

// You should also have these interfaces defined somewhere:
export interface User {
  id: number;
  name: string;
  phone: string;
  address: string;
  sex: "male" | "female";
  status: string;
  dateOfBirth?: string;
  email: string;
  role: Role;
  roleId: number;
  branch?: Branch;
  // Add other fields as needed
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  tags?: string[];
  category: "hair" | "skin" | "nails" | "spa";
  isForChildren: boolean;
  estimatedTimeWomen: number;
  estimatedTimeChildren?: number;
}
export interface BranchService {
  BranchService: {
    availability: boolean;
    branchId: number;
    createdAt: Date;
    serviceId: number;
    updatedAt: Date;
  };
  availability: boolean;
  category: string;
  createdAt: Date;
  description: string;
  estimatedTimeChildren: number;
  estimatedTimeWomen: number;
  id: number;
  image?: string;
  isForChildren: boolean;
  itemId: number;
  name: string;
  price: number;
}
export interface Appointment {
  id: number;
  customerId: number;
  serviceId: number;
  branchId: number;
  staffId: number;
  startTime: Date;
  endTime: Date;
  isForChild: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  notes: string;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
  employeeId: number;
  service: Service;
  customer: User;
  staff: User;
  branch: Branch;
}
