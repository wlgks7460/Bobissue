import React from 'react';

const PostForm = ({ setAddress }) => {
  const sample6_execDaumPostcode = () => {
    new daum.Postcode({
      oncomplete: function (data) {
        let addr = '';
        let extraAddr = '';

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        const fullAddress = `${data.zonecode} ${addr} ${extraAddr}`;
        setAddress(fullAddress);
      },
    }).open();
  };

  return (
    <div>
      <button className="p-2 mt-3 bg-gray-200 border rounded-md" onClick={sample6_execDaumPostcode}>
        우편번호 찾기
      </button>
    </div>
  );
};

export default PostForm;
