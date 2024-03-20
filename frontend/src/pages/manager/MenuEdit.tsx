/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useCallback } from "react";
import PageContainer from "../../containers/pageContainer";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragUpdate,
} from "react-beautiful-dnd";
import { LexoRank } from "lexorank";
import SectionContainer from "../../containers/sectionContainer";
import {
  useGetRestaurantMenuQuery,
  useGetRestaurantQuery,
  useGetTagsQuery,
} from "../../services/customer";
import {
  useUpdateCategoryMutation,
  useUpdateMenuItemMutation,
} from "../../services/manager";
import { useParams } from "react-router";
import LoadingPage from "../errors/LoadingPage";
import NotFoundPage from "../errors/NotFoundPage";
import { useAppDispatch } from "../../hooks";
import { waitManagementApi } from "../../services/waitManagement";
import { Category, MenuItem, RestaurantMenu, Tag } from "../../types";
import CategoryEdit from "./CategoryEdit";
import AddCategoryForm from "../../components/Forms/AddCategoryModal/AddCategoryModal";
import { useNavigate } from "react-router-dom";

type DraggableCategoryProps = {
  restaurantId: number;
  items: MenuItem[];
  category: Category;
  index: number;
  allTags: Tag[];
};
const DraggableCategory: React.FC<DraggableCategoryProps> = ({
  restaurantId,
  items,
  category,
  index,
  allTags,
}: DraggableCategoryProps) => (
  <Draggable
    key={`category-${category.id}`}
    draggableId={`category-${category.id}`}
    index={index}
  >
    {(provided) => (
      <div
        className="collapse collapse-arrow my-5"
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        <input type="checkbox" className="w-8 h-full justify-self-end mr-1" />
        <div className="collapse-title text-lg font-medium bg-base-200 shadow-md">
          {category.name}
        </div>
        <div className="collapse-content bg-base-100">
          <CategoryEdit
            restaurantId={restaurantId}
            categoryId={category.id}
            items={items}
            droppableId={`category-${category.id.toString()}`}
            allTags={allTags}
          />
        </div>
      </div>
    )}
  </Draggable>
);

const reorder = (
  collection: { orderindex: string }[],
  src: number,
  dst: number,
  order: string
) => {
  let orderindex = order;
  const { length } = collection;
  if (dst > src) {
    if (dst === length - 1) {
      // Get next lexorank
      const last = LexoRank.parse(collection[dst].orderindex ?? "");
      orderindex = last.genNext().toString();
    } else {
      // Get between of dst, dst + 1 lexorank
      orderindex = LexoRank.parse(collection[dst + 1].orderindex ?? "")
        .between(LexoRank.parse(collection[dst].orderindex ?? ""))
        .toString();
    }
  } else if (dst < src) {
    // Get prev lexorank of first value
    if (dst === 0) {
      const first = LexoRank.parse(collection[dst].orderindex ?? "");
      orderindex = first.genPrev().toString();
    } else {
      // Get between of dst - 1, dst lexorank
      orderindex = LexoRank.parse(collection[dst - 1].orderindex ?? "")
        .between(LexoRank.parse(collection[dst].orderindex ?? ""))
        .toString();
    }
  }
  return orderindex;
};

const addToCollection = (
  collection: { orderindex: string }[],
  src: number,
  dst: number,
  order: string
) => {
  let orderindex = order;
  const { length } = collection;
  if (length === 0) {
    orderindex = LexoRank.middle().toString();
  } else if (dst === length) {
    const last = LexoRank.parse(collection[dst - 1].orderindex ?? "");
    orderindex = last.genNext().toString();
  } else if (dst === 0) {
    const first = LexoRank.parse(collection[dst].orderindex ?? "");
    orderindex = first.genPrev().toString();
  } else {
    const prev = LexoRank.parse(collection[dst - 1].orderindex ?? "");
    const mid = LexoRank.parse(collection[dst].orderindex ?? "");
    orderindex = prev.between(mid).toString();
  }
  return orderindex;
};

const sortByIndex = (a: { orderindex: string }, b: { orderindex: string }) => {
  if (a.orderindex < b.orderindex) return -1;
  if (a.orderindex > b.orderindex) return 1;
  return 0;
};

const onItemDragEnd = (data: RestaurantMenu, result: DragUpdate) => {
  if (!result.destination) {
    return;
  }
  const id = parseInt(result.draggableId.substring(5), 10);
  const srcCategoryId = parseInt(result.source.droppableId.substring(9), 10);
  const dstCategoryId = parseInt(
    result.destination.droppableId.substring(9),
    10
  );
  const src = result.source.index;
  const dst = result.destination.index;
  const srcCategory = data?.find((category) => category.id === srcCategoryId);
  const dstCategory = data?.find((category) => category.id === dstCategoryId);
  let orderindex = srcCategory?.items[src].orderindex ?? "";

  if (srcCategoryId === dstCategoryId) {
    orderindex = reorder(dstCategory?.items ?? [], src, dst, orderindex);
  } else {
    orderindex = addToCollection(
      dstCategory?.items ?? [],
      src,
      dst,
      orderindex
    );
  }

  const oldItem = srcCategory?.items.find((item) => item.id === id)!;
  let newData = [...data].filter(
    (category) => category.id !== srcCategoryId && category.id !== dstCategoryId
  );

  const newItem = { ...oldItem, orderindex, categoryid: dstCategoryId };

  let newDstCategory = dstCategory;
  let newSrcCategory = srcCategory;
  if (newDstCategory) {
    newDstCategory = {
      ...newDstCategory,
      items: dstCategory?.items.filter((item) => item.id !== id) ?? [],
    };
    newDstCategory.items.push(newItem);
    newDstCategory.items.sort(sortByIndex);
  }
  if (newSrcCategory) {
    newSrcCategory = {
      ...newSrcCategory,
      items: srcCategory?.items.filter((item) => item.id !== id) ?? [],
    };
    newSrcCategory.items.sort(sortByIndex);
  }

  newData.push(newDstCategory!);
  if (srcCategoryId !== dstCategoryId) newData.push(newSrcCategory!);

  newData = newData.sort(sortByIndex);
  return { id, categoryid: dstCategoryId, orderindex, newData };
};

const onCategoryDragEnd = (data: RestaurantMenu, result: DragUpdate) => {
  if (!result.destination) {
    return;
  }
  const orderedCategories = data ? [...data] : [];
  const src = result.source.index;
  const dst = result.destination.index;
  let { orderindex } = orderedCategories[src];
  const { id } = orderedCategories[src];
  orderindex = reorder(orderedCategories, src, dst, orderindex);
  orderedCategories[src] = { ...orderedCategories[src], orderindex };
  orderedCategories.sort(sortByIndex);
  return { id, orderindex, orderedCategories };
};

const MenuEditPage: React.FC = () => {
  const { restaurantId } = useParams();
  const { data, isLoading, isError, isUninitialized } =
    useGetRestaurantMenuQuery(parseInt(restaurantId ?? "0", 10));
  const restaurantData = useGetRestaurantQuery(
    parseInt(restaurantId ?? "0", 10)
  );
  const tagData = useGetTagsQuery({});

  const [updateCategory] = useUpdateCategoryMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const lastRank =
    data && data.length > 0 ? data[data.length - 1].orderindex : undefined;

  const onDragEnd = useCallback(
    (result: DragUpdate) => {
      if (!result.destination) {
        return;
      }
      if (result.type === "droppable-item") {
        const res = onItemDragEnd(data ?? [], result);
        if (res) {
          dispatch(
            waitManagementApi.util.updateQueryData(
              "getRestaurantMenu" as never,
              parseInt(restaurantId ?? "0", 10) as never,
              () => res.newData
            )
          );
          updateMenuItem({
            id: res.id,
            orderindex: res.orderindex,
            categoryid: res.categoryid,
          });
          return;
        }
      }
      const res = onCategoryDragEnd(data ?? [], result);
      if (res) {
        dispatch(
          waitManagementApi.util.updateQueryData(
            "getRestaurantMenu" as never,
            parseInt(restaurantId ?? "0", 10) as never,
            () => {
              return res.orderedCategories;
            }
          )
        );
        updateCategory({ id: res.id, orderindex: res.orderindex });
      }
    },
    [data]
  );

  if (isError) {
    return <NotFoundPage />;
  }
  if (
    isLoading ||
    isUninitialized ||
    tagData.isError ||
    tagData.isLoading ||
    tagData.isUninitialized
  ) {
    return <LoadingPage />;
  }
  return (
    <PageContainer>
      <SectionContainer>
        <div className="bg-base-100 p-5">
          <div className="flex flex-col space-y-4">
            <h1 className="text-3xl font-semibold">
              {restaurantData.data?.name}
            </h1>
            <h1 className="text-2xl">Menu</h1>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" type="droppable-category">
              {(provided) => (
                <div ref={provided.innerRef} className="p-5 bg-base-100">
                  {data.map((category, index) => (
                    <DraggableCategory
                      restaurantId={parseInt(restaurantId ?? "0", 10)}
                      items={category.items}
                      category={category}
                      index={index}
                      key={index}
                      allTags={tagData.data}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <div className="flex justify-between">
            <AddCategoryForm
              restaurantId={parseInt(restaurantId ?? "0", 10)}
              lastRank={lastRank}
            />
            <button
              className="btn btn-info"
              onClick={() => navigate(`/restaurant/${restaurantId}/menu`)}
            >
              View Menu
            </button>
          </div>
        </div>
      </SectionContainer>
    </PageContainer>
  );
};

export default MenuEditPage;
