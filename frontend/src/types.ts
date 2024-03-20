export type Restaurant = {
  name: string;
  comment: string;
  imagepath: string;
  id: number;
  tables: RestaurantTable[];
  menuitems: MenuItem[];
  staff: {
    email: string;
    rolename: string;
  }[];
  categories: Category[];
  orders: CustomerOrderResponse[];
};

export type RestaurantCreate = {
  name: string;
  comment: string;
  imagepath: string;
};

export type RestaurantTable = {
  tableid: number;
  restaurantid: number;
};

export type MenuItem = {
  id: number;
  title: string;
  description: string;
  cost: number;
  imagepath: string;
  ingredients: string;
  tags: Tag[];
  orderindex: string;
  categoryid: number;
  restaurantid: number;
};

export type Category = {
  id: number;
  restaurantid: number;
  name: string;
  orderindex: string;
};

export type CategoryWithItems = Category & {
  items: MenuItem[];
};

export type RestaurantMenu = CategoryWithItems[];

export type TotalOrder = {
  [key: number]: Order[];
};

export type Order = {
  menuitemid: number;
  quantity: number;
};

export type CustomerOrderRequest = {
  tableid: number;
  comment: string;
  restaurantid: number;
  orderitems: Order[];
};

export type CustomerOrder = Order & {
  orderid: number;
  orderstatus: "pending" | "ready" | "served";
};

export type CustomerOrderResponse = {
  tableid: number;
  comment: string;
  restaurantid: number;
  id: number;
  ordered_at: string;
  orderitems: CustomerOrder[];
};

export type RequestAssistance = {
  tableid: number;
  restaurantid: number;
};

export type RequestAssistanceResponse = RequestAssistance & {
  requested_at: string;
  requestid: number;
  statusname: "requesting" | "satisfied";
};

export type PythonError = Error & {
  data: {
    detail: string;
  };
};

export type CreateAccountRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  imagepath: string;
};

export type Account = {
  firstname: string;
  lastname: string;
  email: string;
  imagepath: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: Account;
};

export type StaffRequest = {
  restaurant_id: number;
  email: string;
  role: string;
};

export type StaffResponse = Omit<StaffRequest, "restaurant_id">;

export type Staff = Account & {
  role: "manager" | "waitstaff" | "kitchenstaff";
};

export type Tag = {
  tagname: string;
  colour: string;
  id: number;
};

export type LoyaltyProgram = {
  minimum: number;
  discount: number;
  multiplier: number;
  restaurantid: number;
};

export type UserPoints = {
  points: number;
  restaurantid: number;
  email: string;
  discount: number;
};

export type LoyaltyUser = {
  restaurantid: number;
  points: number;
  user: Account;
};
