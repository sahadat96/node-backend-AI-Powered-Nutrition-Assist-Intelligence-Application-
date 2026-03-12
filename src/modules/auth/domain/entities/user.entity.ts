export interface UserProps {
  id: string;
  email: string;
  password: string;
  roleId?: string;
  role?: any;
  permissions?: string[];
  refreshToken?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  public id: string;
  public email: string;
  public password: string;
  public roleId?: string;
  public role?: any;
  public permissions?: string[];
  public refreshToken?: string | null;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.roleId = props.roleId;
    this.role = props.role;
    this.permissions = props.permissions;
    this.refreshToken = props.refreshToken;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}