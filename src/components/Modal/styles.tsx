import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  // bottom: 70px; /* BottomNav의 높이만큼 공간을 남겨둠 */
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: calc(100% - 70px);
  background-color: rgba(0, 0, 0, 0.4);
  background-color: ${({ modalType }: any) =>
    modalType === "showtodo" ? rgba(0, 0, 0, 0.4) : 999};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ modalType }: any) => (modalType === "showtodo" ? 1000 : 999)};
`;

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 80%;
  max-width: 500px;
  height:
  align-items: center;
  border-radius: 20px;
  
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); 
  z-index: 1001; 
  @media (min-width: 1200px) {
    height: auto;
    width: 30%;
  }
  & > div:nth-child(1) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-bottom:20px;
    & > p {
      cursor: pointer;
      font-size: 1.5rem;
    }
  }
`;

export const ModalTopSection = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const ModalBottomSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > label {
    width: 100%;
    text-align: right;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    & > div {
      display: flex;
      align-items: center;
      & > input {
        margin-right: 10px;
      }
      & > p {
        font-size: 16px;
        font-weight: bold;
      }
    }
    & > span {
      margin-top: 5px;
      font-size: 14px;
      text-align: right;
      color: gray;
    }
  }
`;

export const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  outline: none;
  font-size: 1rem;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s;
  &:focus {
    border-color: #007bff; /* Change border color on focus */
  }
`;

export const ModalButton = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;

  & > button {
    background-color: #007bff;
    border: none;

    border-radius: 10px;
    padding: 7px 20px;
    color: white;
    font-weight: bold;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
      background-color: #0056b3;
    }
  }
`;

export const ShowModalContainer = styled.div`
  position: fixed;
  bottom: 70px;
  width: 100%;

  border-radius: 20px 20px 0 0;
  overflow: hidden;
`;

export const ShowModalTopSection = styled.div`
  background-color: #ffffff;
  padding: 20px;

  & > div:nth-child(1) {
    font-weight: lighter;
    padding-top: 10px;
  }

  & > div:nth-child(2) {
    padding-top: 20px;
    padding-bottom: 20px;
    width: 100%;
    border-bottom: 1px solid #f1f1f1;
    font-size: 12px;
    font-weight: light;
    color: gray;
    flex: 1;
    max-height: 24px;
    align-items: center;
    flex-direction: row;
    display: flex;
  }
  & > div:nth-child(2) p {
    background-color: #50bcdf;
    margin-right: 8px;
    border-radius: 5px;
    padding: 1px 4px;
    text-align: center;
    color: white;
    font-weight: bold;
  }
  & > div:nth-child(2) p:nth-child(2) {
    background-color: #b9a7fc;
  }
  & > div:nth-child(2) p:nth-child(3) {
    background-color: #0d9afc;
  }
  & > div:nth-child(3) {
    margin-top: 20px;
    padding-bottom: 80px;
    padding-top: 20px;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 10px;
  }
`;

export const ShowModalBottomSection = styled.div`
  background-color: #ffffff;
  padding: 20px;
  & > div:nth-child(1) {
    display: flex;

    flex-direction: column;
    align-itemes: center;
    justfy-content: left;
  }
`;

export const CommentContainer = styled.div`
  margin-bottom: 20px;
  padding-left: 10px;
  background-color: #ffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

export const CommentHeader = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 12px;
  flex: 1;
  font-weight: lighter;
`;

export const CommentContent = styled.div`
  font-size: 16px;
  flex: 1;
`;

export const SearchModalContainer = styled.section`
display: flex;
flex-direction: column;
background-color: white;
width: 80%;
max-width: 500px;
height:
align-items: center;
border-radius: 20px;

padding: 20px;
box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3); 
z-index: 1001; 
@media (min-width: 1200px) {
  height: auto;
  width: 30%;
}
`;

export const SearchModalTopSection = styled.div``;

export const SearchModalBottomSection = styled.div`;`;

function rgba(
  arg0: number,
  arg1: number,
  arg2: number,
  arg3: number
): import("styled-components").Interpolation<
  import("styled-components").FastOmit<
    import("react").DetailedHTMLProps<
      import("react").HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    never
  >
> {
  throw new Error("Function not implemented.");
}
