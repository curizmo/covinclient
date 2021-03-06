import styled from 'styled-components';

export const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

export const TopContainer = styled.div`
  padding: 1rem 1.875rem;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const NoteContainer = styled.div`
  padding: 0;
  border: 1px solid #e0e3ea;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px #e0e3ea;
  border-radius: 3px;
  @media (max-width: 768px) {
    margin-top: 2.5rem;
  }
`;

export const SearchDrpWrap = styled.div`
  position: relative;
`;

export const SearchBox = styled.input`
  width: 100%;
  height: 2.8125rem;
  border: 1px solid #e0e3ea;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px #e0e3ea;
  border-radius: 3px;
  font-size: 1.125rem;
  line-height: 1.25rem;
  display: flex;
  align-items: center;
  color: #22335e;
  padding: 1.25rem;
  ::placeholder {
    opacity: 0.45;
  }
`;

export const DropDownWrap = styled.div`
  position: absolute;
  z-index: 1;
  background: #ffffff;
  border: 1px solid #e0e3ea;
  box-sizing: border-box;
  box-shadow: 0px 2px 0px #e0e3ea;
  border-radius: 3px;
  padding: 1rem 1.25rem 0 1.25rem;
  width: 100%;
`;
export const EachItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;
export const Name = styled.span`
  font-size: 1.25rem;
  line-height: 1.25rem;
  color: #22335e;
`;
export const Icon = styled.div`
  cursor: pointer;
`;

export const PrescriptionWrap = styled.div`
  margin: 8px 0;
  position: relative;
`;

export const MedName = styled.div`
  background: #f6f8fa;
  border: 1px solid #e0e3ea;
  font-size: 1rem;
  line-height: 1.25rem;
  display: flex;
  border-radius: 3px;
  align-items: center;
  padding: 0.5rem 1.25rem;
  color: #22335e;
`;
export const MedDose = styled.textarea`
  background: #ffffff;
  border: 1px solid #e0e3ea;
  box-sizing: border-box;
  border-radius: 3px;
  width: 100%;
  font-size: 1rem;
  line-height: 1.125rem;
  color: #22335e;
  height: 45px;
  overflow: hidden;
  padding: 0.8125rem 1.25rem;
  ::placeholder {
    opacity: 0.5;
  }
`;

export const MedIcon = styled.img`
  margin-right: 0.625rem;
`;

export const CloseIcon = styled.img`
  width: 1.125rem;
  height: 1.125rem;
  position: absolute;
  right: -5px;
  top: -5px;
  cursor: pointer;
`;

export const NoteCaption = styled.p`
  padding: 0.5rem 0.7rem;
  margin: 0;
  height: 40px;
  background: #f8fbfe;
  border-radius: 3px;
  font-size: 12px;
  color: #657396;

  opacity: 0.5;
`;

export const Note = styled.textarea`
  background: #ffffff;
  border: none;
  width: 100%;
  height: 12rem;
  padding: 0.75rem;
  ::placeholder {
    color: #22335e;
    opacity: 0.5;
  }
  :focus-visible {
    outline: none;
  }
`;

export const ActionIcon = styled.img`
  width: 2.5rem;
  height: 1.875rem;
`;

export const LastRow = styled.div`
  display: flex;
  padding: 1rem 1.875rem;
  background: #f8fbfe;
  border-bottom: 1px solid rgba(101, 115, 150, 0.2);
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    background: #f8fbfe;
    padding: 0.5rem 0.5rem;
    border-bottom: none;
    margin-bottom: 0.5em;
  }
  cursor: pointer;
`;

export const PastNote = styled.div`
  padding: 1rem;
  margin: 0.5rem 1rem;
  background: #e0e3ea;
  border-bottom: 1px solid rgba(101, 115, 150, 0.2);
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    background: #f8fbfe;
    padding: 0.5rem 0.5rem;
    border-bottom: none;
    margin-bottom: 0.5em;
  }
`;

export const PastPrescriptionImageIcon = styled.img`
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5em;
`;

export const PastPrescriptionText = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  display: flex;
  flex-direction: column;
  color: #22335e;
`;

export const PastOrderText = styled.div`
  padding: 1rem;
  background: #f2f7fd;
  font-weight: bold;
  font-size: 0.9375rem;
  line-height: 1.25rem;
  color: #22335e;
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    font-weight: bold;
    font-size: 0.9375rem;
    line-height: 20px;
    color: #22335e;
    padding: 1em 0em;
    display: block;
  }
`;

export const PastPrescriptionDate = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #22335e;
  opacity: 0.5;
`;

export const PastPrescriptionConsultant = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.25rem;
  color: #22335e;
`;
export const DesktopViewPastPrescription = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: ${(props) => (props.showMore ? 0 : 'auto')};
  border-top: ${(props) =>
    props.showMore ? '1px solid rgba(101, 115, 150, 0.2)' : 'none'};
  background-color: white;
`;

export const IconSmall = styled.div`
  margin-right: 0.5rem;
  display: inline;
`;

export const ImgButton = styled.button`
  border: none;
  background: none;
`;

export const LoadingIcon = styled.div`
  bottom: 2rem !important;
  right: 2.5rem !important;
`;

export const SymptomContainer = styled.div`
  padding: 1rem 0rem;
  margin: 0rem 1.875rem;
  border-bottom: 1px solid rgba(101, 115, 150, 0.2);
  &:last-child {
    border-bottom: none;
  }
  @media (max-width: 768px) {
    background: #f8fbfe;
    padding: 0.5rem 0.5rem;
    border-bottom: none;
    margin: 0rem 0.5rem;
    margin-bottom: 0.5em;
  }
`;

export const DateText = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: #657396;
`;

export const SymptomsText = styled.div`
  color: #22335e;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
`;

export const SymptomsStatus = styled.div`
  color: #009898;
  font-size: 14px;
  line-height: 18px;
`;

export const UploadContainer = styled.div`
  padding: 1rem 0rem;
  color: #3182fb;
  font-size: 14px;
  line-height: 18px;
`;

export const FileName = styled.span`
  color: #3182fb;
  font-size: 14px;
  line-height: 18px;
`;

export const ColumnContainer = styled.div`
  overflow-y: auto;
  height: 67vh;
  padding-bottom: 1rem;
`;

export const PastNotesContainer = styled.div`
  border-top: 1px solid #dfe2e9;
  padding-top: 0.5rem;
`;

export const FileText = styled.span`
  color: #3182fb;
  font-size: 14px;
  line-height: 18px;
`;

export const NoteText = styled.div`
  color: #22335e;
  font-size: 14px;
  line-height: 18px;
`;

export const ResultText = styled.div`
  color: #22335e;
  font-weight: bold;
  font-size: 14px;
  line-height: 18px;
`;

export const ResultNote = styled.div`
  color: #009898;
  font-size: 14px;
  line-height: 18px;
`;
