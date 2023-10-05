import React from "react";
import { Link } from "react-router-dom";
import { CategoryType } from "./entity/CategoryType";

import "./css/Header3rd.css";

const categoryInfo: CategoryType[] = [
  {
    categoryId: 1,
    categoryName: { name: "재배방식", categoryName: "cultivationmethod" },
    categoryElements: {
      organic: { name: "유기농", elementName: "ORGANIC" },
      pesticidefree: { name: "무농약", elementName: "PESTICIDE_FREE" },
      environmentfriendly: { name: "친환경", elementName: "ENVIRONMENT_FRIENDLY" },
    },
  },
  {
    categoryId: 2,
    categoryName: { name: "생산지", categoryName: "region" },
    categoryElements: {
      GYEONGI: { name: "경기", elementName: "경기" },
      GANGWON: { name: "강원", elementName: "강원" },
      CHUNGBUK: { name: "충북", elementName: "충북" },
      CHUNGNAM: { name: "충남", elementName: "충남" },
      GYEONGBUK: { name: "경북", elementName: "경북" },
      GYEONGNAM: { name: "경남", elementName: "경남" },
      JEONBUK: { name: "전북", elementName: "전북" },
      JEONNAM: { name: "전남", elementName: "전남" },
      JEJU: { name: "제주", elementName: "제주" },
    },
  },
];

const CategoryComponent = ({ category }: { category: CategoryType }) => {
  return (
    <div className="category-component">
      <div className="category-name">{category.categoryName.name}</div>
      <div className="category-elements">
        {Object.keys(category.categoryElements).map((key: string) => (
          <Link
            to={
              category.categoryId === 1
                ? `/productList/category/${category.categoryElements[key].elementName}`
                : category.categoryId === 2
                ? `/productList/region/${category.categoryElements[key].elementName}`
                : "/"
            }
            key={key}
          >
            {category.categoryElements[key].name}
          </Link>
        ))}
      </div>
    </div>
  );
};

const Header3rd = () => {
  return (
    <div className="third-header-container">
      {categoryInfo.map((category) => (
        <CategoryComponent key={category.categoryId} category={category} />
      ))}
    </div>
  );
};

export default Header3rd;
