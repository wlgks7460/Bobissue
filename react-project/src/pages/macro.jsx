import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "@/utils/API";
import { StarIcon } from "@heroicons/react/24/solid";

const getRandomItemNo = () => {
  const random = Math.random();
  return random < 0.5
    ? Math.floor(Math.random() * (130 - 100 + 1)) + 100
    : Math.floor(Math.random() * (330 - 200 + 1)) + 200;
};

const getRandomRating = () => Math.floor(Math.random() * 5) + 1;

const getRandomContent = () => {
  const contents = [
    "너무 맛있어요!",
    "별로에요.",
    "배송이 느려요.",
    "빠른 배송 좋아요.",
    "재구매 의사 있어요!",
    "가격 대비 괜찮아요.",
    "맛이 기대보다 별로네요.",
    "냉장 보관이 필요해요.",
    "아이들도 좋아해요!",
    "포장이 훌륭합니다.",
    "신선도가 좋아요.",
    "먹기 편해요.",
    "향이 너무 강해요.",
    "조리가 쉬워요.",
    "양이 많아서 좋아요.",
    "이건 좀 별로네요...",
    "친절한 배송 감사합니다.",
    "가성비 최고예요!",
    "품질이 좋습니다.",
    "선물용으로 좋아요.",
  ];
  return contents[Math.floor(Math.random() * contents.length)];
};

const MyPageReviewCreate = () => {
  const params = useParams();
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const createRandomReview = () => {
    return {
      content: getRandomContent(),
      rating: getRandomRating(),
    };
  };

  const sendBulkReviews = async (numReviews) => {
    setLoading(true);
    setMessage("리뷰를 생성하고 있습니다...");

    const requests = Array.from({ length: numReviews }, () => {
      const itemNo = getRandomItemNo();
      const payload = createRandomReview();
      const formData = new FormData();
      formData.append("review", JSON.stringify(payload));

      return API.post(`/item/${itemNo}/review`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => console.log(`✅ 리뷰 작성 완료 (ItemNo: ${itemNo})`))
        .catch((err) => console.error(`❌ 실패 (ItemNo: ${itemNo})`, err));
    });

    try {
      await Promise.all(requests);
      setMessage(`${numReviews}개의 리뷰가 성공적으로 전송되었습니다.`);
    } catch (error) {
      setMessage("일부 요청이 실패했습니다.");
    }

    setLoading(false);
  };

  return (
    <div className="p-5 text-center">
      <h2 className="text-xl mb-5">후기 작성 테스트</h2>
      <button
        onClick={() => sendBulkReviews(1000)}
        disabled={loading}
        className={`w-full h-12 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-800"
        }`}
      >
        {loading ? "리뷰 생성 중..." : "랜덤 리뷰 1,000개 생성"}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default MyPageReviewCreate;
