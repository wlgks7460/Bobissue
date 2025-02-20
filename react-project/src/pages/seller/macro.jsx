import React, { useState } from "react";
import API from "../../utils/API";

const getRandomItemNo = () => {
  const random = Math.random();
  if (random < 0.5) {
    return Math.floor(Math.random() * (130 - 100 + 1)) + 100;
  } else {
    return Math.floor(Math.random() * (330 - 202 + 1)) + 202;
  }
};

const getRandomCount = () => Math.floor(Math.random() * 9) + 1;
const getRandomUserNo = () => Math.floor(Math.random() * (750 - 470 + 1)) + 470;
const getRandomRequest = () => {
  const requests = ["부재시 경비실에 맡겨주세요", "전화주세요", "문앞에 두세요"];
  return requests[Math.floor(Math.random() * requests.length)];
};

const generatePaymentData = () => {
  return {
    items: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
      itemNo: getRandomItemNo(),
      count: getRandomCount(),
    })),
    userNo: getRandomUserNo(),
    payment: "CARD",
    requests: getRandomRequest(),
    useCouponNo: null,
    usePoint: 0,
    addressNo: 104,
  };
};

const SendBulkOrders = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sendBulkData = async (numRequests) => {
    setLoading(true);
    setMessage("");

    const requests = Array.from({ length: numRequests }, () => {
      const paymentData = generatePaymentData();
      return API.post("/orders", paymentData)
        .then((response) => console.log("Success:", response.data))
        .catch((error) => console.error("Error:", error));
    });

    try {
      await Promise.all(requests);
      setMessage(`${numRequests}개의 주문 요청이 성공적으로 전송되었습니다.`);
    } catch (error) {
      setMessage("일부 요청이 실패했습니다.");
    }

    setLoading(false);
  };

  return (
  
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <button
        onClick={() => sendBulkData(10000)}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "gray" : "blue",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "주문 요청 중..." : "10,000개 주문 보내기"}
      </button>
      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default SendBulkOrders;
