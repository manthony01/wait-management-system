from typing import Annotated, List, Optional, Union
from fastapi import APIRouter, Depends, Security
from sqlalchemy.orm import Session

from ..auth.security import get_current_user

from ..sql_app.schemas.user import User, UserWithRole
from ..sql_app.schemas.restaurant import (
    Category, CategoryPatch, CategoryWithRestaurant,
    CategoryCreate, LoyaltyProgram, LoyaltyProgramCreate, LoyaltyProgramPatch,
    MenuItemCreate, MenuItemPatch, MenuItemRead,
    Restaurant, RestaurantCreate, MenuItem, MenuItemWithTag,
    RestaurantPatch, RestaurantTableCreate, RestaurantTable, Staff, StaffAdd,
    UserWithProgram
)
from ..sql_app.database import get_db
from ..sql_app.crud import manager
router = APIRouter(
    prefix="/manager",
    tags=["manager"],
    responses={404: {"description": "Not found"}}
)
"""
CRUD for restaurants
"""


async def get_current_manager(
    current_user:
        Annotated[User,
                  Security(get_current_user)]
):
    return current_user


@router.get("/restaurants", response_model=List[Restaurant])
async def get_all_manager_restaurants(
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    return manager.get_all_restaurants(db, user)


@router.post("/restaurant", response_model=Restaurant)
async def create_restaurant(
    restaurant: RestaurantCreate,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    restaurant = manager.create_restaurant(db, user, restaurant)
    return restaurant


@router.delete("/restaurant/{restaurant_id}", response_model=Restaurant)
async def delete_restaurant(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    return manager.delete_restaurant(db, restaurant_id)


@router.patch("/restaurant/{restaurant_id}", response_model=Restaurant)
async def update_restaurant(
    restaurant_id: int,
    restaurant: RestaurantPatch,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    return manager.update_restaurant(db, restaurant_id, restaurant)

"""
Restaurant table operations
"""


@router.post("/restaurant/table", response_model=RestaurantTable)
async def create_restaurant_table(
    restaurant_table: RestaurantTableCreate,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(
        db, user, restaurant_table.restaurantid
    )
    return manager.create_restaurant_table(db, restaurant_table)


@router.delete(
    "/restaurant/{restaurant_id}/table/{table_id}",
    response_model=RestaurantTable
)
async def delete_restaurant_table(
    restaurant_id: int,
    table_id: int,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(
        db, user, restaurant_id
    )
    return manager.delete_restaurant_table(db, restaurant_id, table_id)

"""
MenuItem operations
"""


@router.post("/menuItem", response_model=MenuItemRead)
async def create_menu_item(
    menu_item: MenuItemCreate,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, menu_item.restaurantid)
    return manager.create_menu_item(db, menu_item)


@router.delete("/menuItem/{menu_item_id}", response_model=MenuItem)
async def delete_menu_item(
    menu_item_id: int,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    return manager.delete_menu_item(db, menu_item_id)


@router.patch("/menuItem/{menu_item_id}", response_model=MenuItemWithTag)
async def update_menu_item(
    menu_item_id: int,
    menu_item_patch: MenuItemPatch,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    return manager.patch_menu_item(db, menu_item_id, menu_item_patch)


"""
Category operations
"""


@router.post("/category", response_model=CategoryWithRestaurant)
async def create_category(
    category: CategoryCreate,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, category.restaurantid)
    return manager.create_category(db, category)


@router.delete("/category/{category_id}", response_model=Category)
async def delete_category(
    category_id: int,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_category(db, user, category_id)
    return manager.delete_category(db, category_id)


@router.patch("/category/{category_id}", response_model=Category)
async def patch_category(
    category_id: int,
    category_patch: CategoryPatch,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_category(db, user, category_id)
    return manager.patch_category(db, category_id, category_patch)


"""
Managing staff
"""


@router.get(
    "/restaurant/{restaurant_id}/staff",
    response_model=List[UserWithRole]
)
async def get_all_staff(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_manager)],
    role: Optional[Union[str, None]] = None,
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    if not role:
        return manager.get_all_staff(db, restaurant_id)
    return manager.get_all_staff_by_role(
        db, restaurant_id, role
    )


@router.get(
    "/restaurant/{restaurant_id}/staff/{staff_email}",
    response_model=List[Staff]
)
async def get_staff(
    restaurant_id: int,
    staff_email: str,
    role: str,
    db: Session = Depends(get_db)
):
    return manager.get_staff(db, restaurant_id, staff_email, role)


@router.post(
    "/restaurant/{restaurant_id}/staff",
    response_model=Staff
)
async def add_staff(
    restaurant_id: int,
    staff: StaffAdd,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    return manager.add_staff(db, restaurant_id, user, staff)


@router.delete(
    "/staff/{staff_email}",
    response_model=Staff
)
async def delete_staff(
    restaurant_id: int,
    staff: StaffAdd,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    return manager.delete_staff(db, restaurant_id, user, staff)


"""
User Loyalty Program
"""


@router.get(
    "/loyaltyProgram/{restaurant_id}/users",
    response_model=List[UserWithProgram]
)
async def get_users_in_loyalty_program(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    return manager.get_users_in_loyalty_program(db, restaurant_id)


@router.post(
    "/loyaltyProgram",
    response_model=LoyaltyProgram
)
async def create_loyalty_program(
    request: LoyaltyProgramCreate,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, request.restaurantid)
    return manager.create_loyalty_program(db, request)


@router.patch(
    "/loyaltyProgram",
    response_model=LoyaltyProgram
)
async def patch_loyalty_program(
    request: LoyaltyProgramPatch,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, request.restaurantid)
    return manager.update_loyalty_program(db, request)


@router.delete(
    "/loyaltyProgram/{restaurant_id}",
    response_model=LoyaltyProgram
)
async def delete_loyalty_program(
    restaurant_id: int,
    user: Annotated[User, Security(get_current_manager)],
    db: Session = Depends(get_db)
):
    manager.verify_manager_owns_restaurant(db, user, restaurant_id)
    return manager.delete_loyalty_program(db, restaurant_id)
