import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUser } from 'selectors';
import { Container, Row, Col, Button, FormGroup } from 'reactstrap';
import { InputField } from 'components/common/InputField';
import * as specialtyService from '../../services/specialty';
import { DashboardLayout } from 'components/common/Layout';
import { useQuery } from 'react-query';
import { AiFillCamera } from 'react-icons/ai';
import { Webcam } from 'components/common/Webcam';
import { generateFileObjectFromBase64 } from 'utils/file';
import { PeopleCircle } from 'components/common/icons/PeopleCircle';
import '../../styles/Profile.css';
import {
  usePractitionerProfile,
  useSaveProfile,
} from './../../services/practitioner';
import { useForm } from 'react-hook-form';
import { practitionerProfile } from 'validations/practicionerProfile';
import { yupResolver } from '@hookform/resolvers/yup';
import { arrayObjectFixer } from 'utils';

const Profile = () => {
  const user = useSelector(getUser);
  const { register, handleSubmit, errors, setValue } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(practitionerProfile),
  });

  const history = useHistory();
  const [displayProfilePictureWebcam, setDisplayProfilePictureWebcam] =
    useState(false);
  const profilePictureRef = useRef();
  const { data: specialties } = useQuery('fetchSpecialties', () =>
    specialtyService.getSpecialtyList(),
  );
  const [selectedProfileImage, setSelectedProfileImage] = useState();
  const [preview, setPreview] = useState();
  const certifications = [{ id: 'MD', name: 'MD' }];
  const { data: profileData, isLoading } = usePractitionerProfile(user.AuthID);
  const [profile, setProfile] = useState({
    authID: user.AuthID,
    title: '',
    firstName: '',
    gender: '',
    dateOFBirth: null,
    lastName: '',
    certification: '',
    specialtyId: '',
    profilePicture: null,
    profilePictureUrl: '',
  });

  const titleTypes = ['Dr.', 'Mr.'];

  useEffect(() => {
    if (profileData) {
      setProfile((prev) => ({ ...prev, profileData }));
      arrayObjectFixer(profileData).map((data) => setValue(...data));
    }
  }, [profileData]);

  useEffect(() => {
    if (!selectedProfileImage) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedProfileImage);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedProfileImage]);

  const handleProfilePictureUpload = (e) => {
    const updatedProfile = {
      ...profile,
      profilePicture: e.target.files[0],
      profilePictureUrl: e.target.files[0] ? e.target.files[0].name : '',
    };

    setProfile(updatedProfile);
    setSelectedProfileImage(e.target.files[0]);
  };

  const openProfilePictureCamera = () => {
    setDisplayProfilePictureWebcam(true);
  };

  const closeProfilePictureCamera = () => {
    setDisplayProfilePictureWebcam(false);
  };

  const handleProfilePictureClick = useCallback(() => {
    const image = profilePictureRef.current.getScreenshot();
    const fileName = `screenshot-${new Date().getTime()}.png`;
    const fileObject = generateFileObjectFromBase64(image, fileName);

    const updateProfile = {
      ...profile,
      profilePicture: fileObject,
      profilePictureUrl: fileObject ? fileObject.name : '',
    };

    setProfile(updateProfile);
    setSelectedProfileImage(fileObject);

    closeProfilePictureCamera();
  }, [profilePictureRef, profile]);

  const deleteProfilePictureKeyDown = (event) => {
    if (event.keyCode === 13) {
      deleteProfilePicture();
    }
  };

  const deleteProfilePicture = () => {
    const updateProfile = {
      ...profile,
      profilePicture: null,
      profilePictureUrl: '',
    };
    setProfile(updateProfile);
  };

  const deleteProfilePreview = () => {
    setPreview(null);
    setSelectedProfileImage(null);
    deleteProfilePicture();
  };

  const deleteProfilePreviewKeyDown = (event) => {
    if (event.keyCode === 13) {
      deleteProfilePreview();
    }
  };

  const { profilePictureUrl, firstName } = profile;
  const { mutate: saveProfile } = useSaveProfile();
  const handleSave = async (values) => {
    try {
      let updatedProfile = {
        ...profile,
        ...values,
        displayName: `${values.firstName} ${values.lastName}`,
      };

      const form = new FormData();
      Object.keys(updatedProfile).forEach((key) => {
        form.append(key, updatedProfile[key]);
      });
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      await saveProfile(form, config);

      history.push('/overview');
    } catch (err) {
      // @todo Handle error
    }
  };

  if (isLoading) {
    return <p>Loading..</p>;
  }
  return (
    <>
      <DashboardLayout>
        <div className="edit-profile-container">
          <Container className="p-5">
            <Row>
              <Col md={{ size: 8, offset: 2 }}>
                <form onSubmit={handleSubmit(handleSave)}>
                  <h2 className="mb-5">Edit Profile</h2>
                  <Webcam
                    isOpen={displayProfilePictureWebcam}
                    handleClose={closeProfilePictureCamera}
                    webcamRef={profilePictureRef}
                    handleImageClick={handleProfilePictureClick}
                  />
                  <InputField
                    title="Title:"
                    type="select"
                    labelSize={3}
                    innerRef={register}
                    name="title"
                    required>
                    <option value="" disabled hidden default>
                      Select Title
                    </option>
                    {titleTypes.map((type) => {
                      return (
                        <option value={type} key={type} className="p-2">
                          {type}
                        </option>
                      );
                    })}
                  </InputField>
                  <InputField
                    innerRef={register}
                    title="First Name:"
                    name="firstName"
                    required
                    error={errors?.firstName?.message}
                    labelSize={3}
                  />
                  <InputField
                    innerRef={register}
                    title="Last Name:"
                    name="lastName"
                    error={errors?.lastName?.message}
                    required
                    labelSize={3}
                  />
                  <InputField
                    innerRef={register}
                    title="Specialty:"
                    type="select"
                    name="specialtyId"
                    labelSize={3}
                    required>
                    <option value="" disabled hidden default>
                      Select Specialty
                    </option>
                    {specialties &&
                      specialties.map((specialty) => {
                        return (
                          <option
                            value={specialty.id}
                            key={specialty.id}
                            className="p-2">
                            {specialty.name}
                          </option>
                        );
                      })}
                  </InputField>
                  <InputField
                    title="Certification:"
                    type="select"
                    name="certification"
                    labelSize={3}
                    required>
                    <option value="" disabled hidden default>
                      Select Certification
                    </option>
                    {certifications &&
                      certifications.map((certification) => {
                        return (
                          <option
                            value={certification.id}
                            key={certification.id}
                            className="p-2">
                            {certification.name}
                          </option>
                        );
                      })}
                  </InputField>
                  <InputField
                    inline={false}
                    title="Upload/Take profile picture"
                    type="file"
                    name="Upload"
                    customClass="d-none"
                    onChange={handleProfilePictureUpload}
                    className="w-full opacity-0 h-full absolute inset-0"
                  />
                  <AiFillCamera onClick={openProfilePictureCamera} />
                  {!selectedProfileImage && (
                    <div className="img-wrap">
                      {profilePictureUrl ? (
                        <>
                          <span
                            role="button"
                            tabIndex="0"
                            onClick={deleteProfilePicture}
                            onKeyDown={deleteProfilePictureKeyDown}
                            className="close">
                            &times;
                          </span>
                          <img
                            src={profilePictureUrl}
                            alt={firstName}
                            className="rounded img-fluid"
                            style={{ maxWidth: 120 }}
                          />
                        </>
                      ) : (
                        <PeopleCircle size="4rem" />
                      )}
                    </div>
                  )}
                  {selectedProfileImage && (
                    <div className="img-wrap mx-2">
                      (
                      <>
                        <span
                          role="button"
                          tabIndex="0"
                          onClick={deleteProfilePreview}
                          onKeyDown={deleteProfilePreviewKeyDown}
                          className="close">
                          &times;
                        </span>
                        <img
                          height="100"
                          width="100"
                          alt={firstName}
                          src={preview}
                        />
                      </>
                      )
                    </div>
                  )}
                  <FormGroup row>
                    <Col sm={{ size: 10, offset: 3 }} className="my-2">
                      <Button type="submit">Save</Button>
                    </Col>
                  </FormGroup>
                </form>
              </Col>
            </Row>
          </Container>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Profile;
