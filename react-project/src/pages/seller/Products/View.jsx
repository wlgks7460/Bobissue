import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "@/utils/API";

const View = () => {
  const navigate = useNavigate();
  const { itemNo } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await API.get(`/item/${itemNo}`);
        console.log("📌 상품 상세 API 응답:", response.data);

        if (response.data.status === "OK" && response.data.result?.data) {
          const item = response.data.result.data;

          setProduct({
            itemNo: item.itemNo,
            name: item.name,
            category: `${item.category.parentName} > ${item.category.name}`,
            productImage: item.images?.[0]?.imageUrl || "",
            company: item.companyNo?.name || "회사 정보 없음",
            price: item.price,
            salePrice: item.salePrice,
            stock: item.stock,
            expiredAt: item.expiredAt,
            description: item.description,
            createdAt: new Date(item.createdAt).toLocaleDateString(),
          });
        } else {
          console.error("상품 데이터 조회 실패:", response.data.message?.label || "알 수 없는 오류");
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [itemNo]);

  const handleUpdateClick = () => {
    navigate("update", { state: product });
  };

  const handleDeleteClick = async () => {
    const isConfirmed = window.confirm(`'${product.name}' 상품 삭제 요청을 보내시겠습니까?`);
    if (isConfirmed) {
      try {
        const response = await API.post("/api/delete-request", {
          productId: product.itemNo,
          reason: "사용자 요청",
        });

        if (response.status === 200) {
          alert("삭제 요청이 관리자에게 전송되었습니다.");
          navigate("/seller/products");
        } else {
          alert("삭제 요청을 처리하는 데 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("삭제 요청 오류:", error);
        alert("삭제 요청 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">상품 정보를 불러오는 중...</p>;
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center border-b pb-4">🛍 상품 상세정보</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* ✅ 상품 이미지 */}
        <div className="flex justify-center">
          {product.productImage ? (
            <img
              src={product.productImage}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg border shadow-md"
            />
          ) : (
            <p className="text-center text-gray-500">이미지가 없습니다.</p>
          )}
        </div>

        {/* ✅ 상품 상세 정보 */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">{product.name}</h2>
          <p className="text-gray-600">
            <strong>📌 카테고리:</strong> {product.category}
          </p>
          <p className="text-gray-600">
            <strong>🏢 회사:</strong> {product.company}
          </p>
          <p className="text-xl font-bold">
            {product.salePrice.toLocaleString()}원{" "}
            <del className="text-gray-500 text-lg ml-2">{product.price.toLocaleString()}원</del>
          </p>
          <p className="text-gray-600">
            <strong>📦 재고:</strong>{" "}
            <span
              className={`font-semibold ${
                product.stock <= 5 ? "text-red-500" : "text-green-500"
              }`}
            >
              {product.stock}개 {product.stock <= 5 && "🔥 (Low Stock!)"}
            </span>
          </p>
          <p className="text-gray-600">
            <strong>📅 등록일:</strong> {product.createdAt}
          </p>
          <p className="text-gray-600">
            <strong>⏳ 판매 종료일:</strong> {product.expiredAt}
          </p>
          <p className="text-gray-700">{product.description || "설명 없음"}</p>

          {/* ✅ 액션 버튼 */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={handleUpdateClick}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300 transition-all hover:scale-105"
            >
              ✏️ 수정하기
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 focus:ring focus:ring-red-300 transition-all hover:scale-105"
            >
              🗑 삭제 요청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
