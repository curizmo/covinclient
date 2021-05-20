import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  AiOutlineClose,
  AiFillCamera,
  AiOutlineCloudUpload,
} from 'react-icons/ai';

import { debounce } from 'lodash';
import { Link, useHistory } from 'react-router-dom';
import { Container, Row, Col, Button, Form, Badge, Label } from 'reactstrap';
import { useDispatch } from 'react-redux';

import { InputField } from 'components/common/InputField';
import { Webcam } from 'components/common/Webcam';

import { getTabIndex } from 'utils';

import {
  getOrganizationByOrganizationName,
  getOrganizationBySubdomain,
} from 'services/organization';
import { getOrganizationTypes } from 'services/organizationType';
import { getPractitionerTypes } from 'services/practitionerType';
import { getSpecialties } from 'services/specialty';
import { createPractitionerRegistration } from 'services/practitioner';
import { fetchCurrentUser } from 'services/user';

import { showSpinner, hideSpinner } from 'actions/spinner';
import { setUser } from 'actions/user';

import { PRACTITIONER_TYPES, ORGANIZATION_TYPES, ENTER } from '../constants';
import { generateFileObjectFromBase64 } from 'utils/file';
import { SUBDOMAIN_REGEX } from '../constants/regex';

import { useSelector } from 'react-redux';
import { getUser as getLoggedInUser } from 'selectors';

const PhysicianSignup = () => {
  const [state, setState] = useState({
    practitionerType: '',
    organizationName: '',
    subdomain: '',
    organizationType: '',
    country: '',
    identificationImages: [],
    profilePicture: null,
    phone: '',
    addressOne: '',
    addressTwo: '',
    city: '',
    countryState: '',
    zip: '',
    specialty: '',
    title: '',
    certification: '',
  });
  const [errors, setErrors] = useState({
    organizationName: false,
    subdomain: false,
    subdomainPattern: false,
  });
  const [isValid, setIsValid] = useState(false);
  const [practitionerTypes, setPractitionerTypes] = useState([]);
  const [organizationTypes, setOrganizationTypes] = useState([]);
  const [displayProfilePictureWebcam, setDisplayProfilePictureWebcam] =
    useState(false);
  const [displayIdWebcam, setDisplayIdWebcam] = useState(false);
  const profilePictureRef = useRef();
  const idPictureRef = useRef();
  const inputIdentificationImages = useRef();
  const inputProfilePicture = useRef();
  const [isSubdomainValid, setIsSubdomainValid] = useState(true);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);

  const history = useHistory();
  const dispatch = useDispatch();

  const loggedInUser = useSelector(getLoggedInUser);

  const fetchOrganizationOptions = async () => {
    try {
      const response = await getOrganizationTypes();
      const organizationTypes =
        (response && response.data && response.data.organizationTypes) || [];

      setOrganizationTypes(organizationTypes);

      return organizationTypes;
    } catch (err) {
      // TODO: Handle error
    }
  };

  const fetchPractitionerOptions = async () => {
    try {
      const response = await getPractitionerTypes();
      const practitionerTypes =
        (response && response.data && response.data.practitionerTypes) || [];

      setPractitionerTypes(practitionerTypes);

      return practitionerTypes;
    } catch (err) {
      // TODO: Handle error
    }
  };

  const fetchSpecialtyOptions = async () => {
    try {
      const response = await getSpecialties();
      const specialties =
        (response && response.data && response.data.specialties) || [];

      setSpecialtyOptions(specialties);

      return practitionerTypes;
    } catch (err) {
      // TODO: Handle error
    }
  };

  const fetchOptions = async () => {
    try {
      const [practitionerTypes, organizationTypes] = await Promise.all([
        fetchPractitionerOptions(),
        fetchOrganizationOptions(),
      ]);

      const physician = practitionerTypes.find(
        (practitionerType) =>
          practitionerType.practitionerTypeDesc ===
          PRACTITIONER_TYPES.PHYSICIAN,
      );

      const careTeam = organizationTypes.find(
        (organizationType) =>
          organizationType.organizationTypeDesc ===
          ORGANIZATION_TYPES.CARE_TEAM,
      );

      setState({
        ...state,
        practitionerType: physician.practitionerTypeId,
        organizationType: careTeam.organizationTypeId,
      });
    } catch (err) {
      // TODO: Handle error
    }
  };

  useEffect(() => {
    fetchOptions();
    fetchSpecialtyOptions();
  }, []);

  const getUser = async () => {
    const response = await fetchCurrentUser();

    return response.data.user;
  };

  const handleChange = (e) => {
    const newState = {
      ...state,
      [e.target.name]: e.target.value,
    };

    setState(newState);
    validateForm(newState, errors);
  };

  const onUploadIdentificationImages = () => {
    inputIdentificationImages.current.click();
  };

  const onUploadProfilePicture = () => {
    inputProfilePicture.current.click();
  };

  const validateForm = (state, errors) => {
    const {
      practitionerType,
      organizationName,
      subdomain,
      organizationType,
      country,
      addressOne,
      zip,
      countryState,
      city,
    } = state;

    const isValid =
      practitionerType &&
      organizationName &&
      subdomain &&
      organizationType &&
      country &&
      phone &&
      addressOne &&
      zip &&
      countryState &&
      city &&
      !errors.organizationName &&
      !errors.subdomain &&
      isSubdomainValid;

    setErrors({
      ...errors,
    });

    setIsValid(isValid);
  };

  const delayedHandleOrganizationNameChange = useCallback(
    debounce(
      (organizationName) => fetchOrganizationByName(organizationName),
      1000,
    ),
    [errors.organizationName, errors.subdomain],
  );

  const delayedHandleSubdomainChange = useCallback(
    debounce((subdomain) => fetchOrganizationBySubdomain(subdomain), 1000),
    [errors.organizationName, errors.subdomain],
  );

  const handleOrganizationNameChange = (e) => {
    const organizationName = e.target.value;

    const newState = {
      ...state,
      organizationName,
    };

    setState(newState);
    validateForm(newState, errors);
    delayedHandleOrganizationNameChange(organizationName);
  };

  const handleSubdomainchange = (e) => {
    const subdomain = e.target.value;

    const newState = {
      ...state,
      subdomain,
    };

    const isSubdomainValid = SUBDOMAIN_REGEX.test(subdomain);

    setIsSubdomainValid(isSubdomainValid);
    setState(newState);
    validateForm(newState, errors);
    delayedHandleSubdomainChange(subdomain);
  };

  const fetchOrganizationByName = async (organizationName) => {
    try {
      const response = await getOrganizationByOrganizationName(
        organizationName,
      );

      const newErrors = {
        ...errors,
        organizationName: !!response.data.organization,
      };

      setErrors(newErrors);
      validateForm(state, newErrors);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const fetchOrganizationBySubdomain = async (subdomain) => {
    try {
      const response = await getOrganizationBySubdomain(subdomain);

      const newErrors = {
        ...errors,
        subdomain: !!response.data.organization,
      };

      setErrors(newErrors);
      validateForm(state, newErrors);
    } catch (err) {
      // TODO: Handle error
    }
  };

  const handleProfilePictureUpload = (e) => {
    const newState = {
      ...state,
      profilePicture: e.target.files[0],
    };

    setState(newState);
    validateForm(newState, errors);
  };

  const handleIdentificationImagesUpload = (e) => {
    const newState = {
      ...state,
      identificationImages: [...state.identificationImages, ...e.target.files],
    };

    setState(newState);
    validateForm(newState, errors);
  };

  const deleteIdentificationImage = (index) => {
    const newState = {
      ...state,
      identificationImages: state.identificationImages.filter(
        (img, i) => i !== index,
      ),
    };

    setState(newState);
    validateForm(newState, errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isValid) {
        return;
      }

      dispatch(showSpinner());

      await createPractitionerRegistration(state);

      const user = await getUser();

      dispatch(
        setUser({ ...user, isLoggedIn: true, isFirstTimeSignUp: false }),
      );
      dispatch(hideSpinner());
      history.push('/appointments');
    } catch (err) {
      dispatch(hideSpinner());
      // TODO: Handle error
    }
  };

  const skip = async (e) => {
    e.preventDefault();
    dispatch(
      setUser({
        ...loggedInUser,
        isFirstTimeSignUp: false,
      }),
    );
    history.push('/appointments');
  };

  const openProfilePictureCamera = () => {
    setDisplayProfilePictureWebcam(true);
  };

  const closeProfilePictureCamera = () => {
    setDisplayProfilePictureWebcam(false);
  };

  const openIdCamera = () => {
    setDisplayIdWebcam(true);
  };

  const closeIdCamera = () => {
    setDisplayIdWebcam(false);
  };

  const handleProfilePictureClick = useCallback(() => {
    const image = profilePictureRef.current.getScreenshot();
    const fileName = `screenshot-${new Date().getTime()}.png`;
    const fileObject = generateFileObjectFromBase64(image, fileName);

    const newState = {
      ...state,
      profilePicture: fileObject,
    };

    setState(newState);
    validateForm(newState, errors);
    closeProfilePictureCamera();
  }, [profilePictureRef, errors, state]);

  const handleIdPictureClick = useCallback(() => {
    const image = idPictureRef.current.getScreenshot();
    const fileName = `screenshot-${new Date().getTime()}.png`;
    const fileObject = generateFileObjectFromBase64(image, fileName);

    const newState = {
      ...state,
      identificationImages: [...state.identificationImages, fileObject],
    };

    setState(newState);
    validateForm(newState, errors);
    closeIdCamera();
  }, [idPictureRef, state, errors]);

  const {
    practitionerType,
    organizationName,
    subdomain,
    organizationType,
    country,
    phone,
    addressOne,
    addressTwo,
    zip,
    countryState,
    city,
    profilePicture,
    identificationImages,
    specialty,
    title,
    certification,
  } = state;

  return (
    <>
      <div className="header-wrapper">
        <p className="header-content">Practitioner Enrollment</p>
      </div>
      <div className="enrollment-form-wrapper">
        <Container className="enrollment-form-container">
          <div className="required-indication-bar">
            <span className="required-indicator">Required field</span>
          </div>
          <Row className="wrapper-row">
            <Col lg={{ size: 11 }}>
              <Webcam
                isOpen={displayProfilePictureWebcam}
                handleClose={closeProfilePictureCamera}
                webcamRef={profilePictureRef}
                handleImageClick={handleProfilePictureClick}
              />

              <Webcam
                isOpen={displayIdWebcam}
                handleClose={closeIdCamera}
                webcamRef={idPictureRef}
                handleImageClick={handleIdPictureClick}
              />
              <Form className="enrollment-form">
                <div className="form-inputs">
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Select the type of practitioner that best describes you "
                        type="select"
                        value={practitionerType}
                        name="practitionerType"
                        onChange={handleChange}
                        onBlur={handleChange}
                        customClass="input-style styled-select"
                        required>
                        <option value="" disabled hidden default>
                          Select practitioner type
                        </option>
                        {practitionerTypes.map((type) => {
                          return (
                            <option
                              key={type.practitionerTypeDesc}
                              value={type.practitionerTypeId}>
                              {type.practitionerTypeDesc}
                            </option>
                          );
                        })}
                      </InputField>
                    </Col>
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Organization type "
                        type="select"
                        value={organizationType}
                        name="organizationType"
                        onChange={handleChange}
                        onBlur={handleChange}
                        customClass="input-style styled-select"
                        required>
                        <option value="" disabled hidden default>
                          Select organization type
                        </option>
                        {organizationTypes.map((type) => {
                          return (
                            <option
                              value={type.organizationTypeId}
                              key={type.organizationTypeDesc}>
                              {type.organizationTypeDesc}
                            </option>
                          );
                        })}
                      </InputField>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Enter a unique name for your organization "
                        value={organizationName}
                        name="organizationName"
                        type="text"
                        customClass="input-style"
                        placeholder="Enter your organization name"
                        onChange={handleOrganizationNameChange}
                        invalid={Boolean(errors.organizationName)}
                        error={
                          errors.organizationName
                            ? 'This organization name already exists'
                            : null
                        }
                        required
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Enter a subdomain for your organization "
                        type="text"
                        placeholder="Enter subdomain"
                        onChange={handleSubdomainchange}
                        name="subdomain"
                        value={subdomain}
                        customClass="input-style"
                        invalid={Boolean(errors.subdomain || !isSubdomainValid)}
                        error={
                          !isSubdomainValid || errors.subdomain
                            ? !isSubdomainValid
                              ? 'Subdomain cannot contain capital letters, special characters or space and must start/end with alphanumeric characters'
                              : 'This subdomain already exists'
                            : null
                        }
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Primary Country of practice "
                        type="select"
                        value={country}
                        name="country"
                        customClass="input-style styled-select"
                        onChange={handleChange}
                        onBlur={handleChange}
                        required>
                        <option value="" disabled hidden default>
                          Select country
                        </option>
                        <option value="Canada">Canada</option>
                        <option value="USA">USA</option>
                      </InputField>
                    </Col>
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Phone "
                        type="text"
                        placeholder="Enter phone number"
                        onChange={handleChange}
                        name="phone"
                        className="border"
                        customClass="input-style"
                        value={phone}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Select your specialty "
                        type="select"
                        value={specialty}
                        name="specialty"
                        customClass="input-style styled-select"
                        onChange={handleChange}
                        onBlur={handleChange}
                        required>
                        <option value="" disabled hidden default>
                          Select your specialty
                        </option>
                        {specialtyOptions.map((type) => {
                          return (
                            <option
                              key={type.specialty}
                              value={type.specialtyId}>
                              {type.specialty}
                            </option>
                          );
                        })}
                      </InputField>
                    </Col>
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Title"
                        type="text"
                        placeholder="Enter title"
                        value={title}
                        name="title"
                        customClass="input-style"
                        onChange={handleChange}
                        onBlur={handleChange}></InputField>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Certification"
                        type="text"
                        placeholder="Enter certification"
                        value={certification}
                        name="certification"
                        customClass="input-style"
                        onChange={handleChange}
                        onBlur={handleChange}></InputField>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Address one "
                        value={addressOne}
                        name="addressOne"
                        type="text"
                        placeholder="Enter address line 1"
                        onChange={handleChange}
                        customClass="input-style"
                        className="border"
                        required
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Address two"
                        type="text"
                        placeholder="Enter address line 2"
                        onChange={handleChange}
                        name="addressTwo"
                        customClass="input-style"
                        className="border"
                        value={addressTwo}
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="State/Province "
                        value={countryState}
                        name="countryState"
                        type="text"
                        placeholder="Enter state/province"
                        onChange={handleChange}
                        className="border"
                        customClass="input-style"
                        required
                      />
                    </Col>
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="City "
                        type="text"
                        placeholder="Enter city name"
                        onChange={handleChange}
                        name="city"
                        className="border"
                        customClass="input-style"
                        value={city}
                        required
                      />
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md="6">
                      <InputField
                        inline={false}
                        title="Zip "
                        type="text"
                        placeholder="Enter zipcode"
                        onChange={handleChange}
                        name="zip"
                        className="border"
                        customClass="input-style"
                        value={zip}
                        required
                      />
                    </Col>
                  </Row>
                </div>
                <div className="form-uploads">
                  <Row className="uploads-wrapper">
                    <Col className="upload-column mr-3">
                      <Label>Upload identification images</Label>
                      <div
                        role="button"
                        tabIndex={getTabIndex()}
                        className="file-upload"
                        onClick={onUploadIdentificationImages}
                        onKeyPress={(e) => {
                          if (e.key === ENTER) {
                            onUploadIdentificationImages();
                          }
                        }}>
                        <input
                          type="file"
                          onChange={handleIdentificationImagesUpload}
                          style={{ display: 'none' }}
                          id="imgupload"
                          ref={inputIdentificationImages}
                        />
                        <span>
                          <AiOutlineCloudUpload
                            size={25}
                            className="inline cursor-pointer mr-3"
                          />
                          Upload Image
                        </span>
                      </div>
                      <div
                        role="button"
                        tabIndex={getTabIndex()}
                        className="file-upload"
                        onKeyPress={(e) => {
                          if (e.key === ENTER) {
                            openIdCamera();
                          }
                        }}
                        onClick={openIdCamera}>
                        <span>
                          <AiFillCamera
                            size={25}
                            className="inline cursor-pointer mr-3"
                          />
                          Take a picture
                        </span>
                      </div>
                      <div>
                        {identificationImages.map((img, index) => (
                          <span key={index} className="file-wrapper">
                            <Badge color="none">{img.name}</Badge>
                            <AiOutlineClose
                              className="inline cursor-pointer"
                              onClick={() => deleteIdentificationImage(index)}
                            />
                          </span>
                        ))}
                      </div>
                    </Col>
                    <Col className="upload-column ml-3">
                      <Label>Upload/Take profile picture</Label>
                      <div
                        role="button"
                        tabIndex={getTabIndex()}
                        className="file-upload"
                        onClick={onUploadProfilePicture}
                        onKeyPress={(e) => {
                          if (e.key === ENTER) {
                            onUploadProfilePicture();
                          }
                        }}>
                        <input
                          type="file"
                          onChange={handleProfilePictureUpload}
                          style={{ display: 'none' }}
                          id="imgupload"
                          ref={inputProfilePicture}
                        />
                        <span>
                          <AiOutlineCloudUpload
                            size={25}
                            className="inline cursor-pointer mr-3"
                          />
                          Upload Image
                        </span>
                      </div>
                      <div
                        role="button"
                        tabIndex={getTabIndex()}
                        className="file-upload"
                        onClick={openProfilePictureCamera}
                        onKeyPress={(e) => {
                          if (e.key === ENTER) {
                            openProfilePictureCamera();
                          }
                        }}>
                        <span>
                          <AiFillCamera
                            size={25}
                            className="inline cursor-pointer mr-3"
                          />
                          Take a picture
                        </span>
                      </div>
                      <div>
                        {profilePicture && (
                          <span className="file-wrapper">
                            <Badge color="none">{profilePicture.name}</Badge>
                          </span>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
                <Row>
                  <Button
                    color="primary"
                    size="lg"
                    disabled={!isValid}
                    onClick={handleSubmit}
                    className="enrollment-submit">
                    SUBMIT
                  </Button>
                </Row>
                <Row>
                  {loggedInUser && loggedInUser.isFirstTimeSignUp && (
                    <Link color="link" className="cancel-link" onClick={skip}>
                      Skip
                    </Link>
                  )}
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default PhysicianSignup;
