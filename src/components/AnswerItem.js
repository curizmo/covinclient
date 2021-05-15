/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ReactTinyLink } from 'react-tiny-link';
import { Badge, ButtonGroup } from 'reactstrap';
import PropTypes from 'prop-types';

import { LikeButton } from './LikeButton';
import FlagButton from './FlagButton';
import TelevideoButton from './TelevideoButton';
import ShareButton from './ShareButton';

import config from '../config/config';

const PREVIEW_CHARS = 200;
const TAB_INDEX = 0;

export const AnswerItem = ({
  answer,
  youtubeLinks,
  handleReportAnswer,
  handleAnswerLike,
  question,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState(false);
  const { t } = useTranslation('physicianView');
  const firstAnsweredBy = answer?.firstAnsweredBy?.name || '';
  const firstAnsweredOn = new Date(answer.firstAnsweredOn * 1000)
    .toDateString()
    .substring(4);
  const lastAnsweredBy = answer.lastAnsweredBy
    ? answer.lastAnsweredBy.name
    : '';
  const lastAnsweredOn = new Date(answer.lastAnsweredOn * 1000)
    .toDateString()
    .substring(4);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setExpanded(!expanded);
    }
  };

  const reportAnswer = () => {
    handleReportAnswer(answer);
  };

  useEffect(() => {
    setSelected(answer?.flag > 0);
  }, [answer]);

  return (
    <div className="mb-2 pb-2 border-bottom">
      <div className="d-flex justify-content-between mb-3">
        <div className="text-primary font-weight-bold mr-2">A.</div>
        <div className="flex-grow-1">
          {answer.text.length > PREVIEW_CHARS ? (
            <p>
              {expanded
                ? answer.text
                : `${answer.text.substring(0, PREVIEW_CHARS)}...`}
              <a
                className="ml-2 small"
                onClick={() => setExpanded(!expanded)}
                onKeyPress={handleKeyPress}
                role="button"
                tabIndex={TAB_INDEX}>
                {expanded ? t('common:showLess') : t('common:showMore')}
              </a>
            </p>
          ) : (
            <p>{answer.text}</p>
          )}

          {answer.images &&
            answer.images.map((image, index) => (
              <img
                src={image}
                key={`qna_${answer.id}_image_${index}`}
                alt="Resources"
                fluid
                className="img-fluid m-3"
              />
            ))}

          {answer.links &&
            answer.links.map((link, index) => (
              <div key={`qna_${answer.id}_link_${index}`} className="mb-3">
                <div>
                  {link && (
                    <ReactTinyLink
                      cardSize="small"
                      showGraphic
                      maxLine={2}
                      minLine={1}
                      url={link}
                      proxyUrl={config.corsProxyUrl}
                      loadSecureUrl
                    />
                  )}
                </div>
              </div>
            ))}

          {answer.sources &&
            answer.sources.map((source, index) => (
              <div key={`qna_${answer.id}_source_${index}`} className="mb-3">
                <div>
                  {source && (
                    <ReactTinyLink
                      cardSize="small"
                      showGraphic
                      maxLine={2}
                      minLine={1}
                      url={source}
                      proxyUrl={config.corsProxyUrl}
                      loadSecureUrl
                    />
                  )}
                </div>
              </div>
            ))}

          {youtubeLinks &&
            youtubeLinks.map((y, index) => {
              const videoSrc = `https://www.youtube.com/embed/${y}?autoplay=false`;

              return (
                y && (
                  <div
                    key={`qna_${answer.id}_youtube_${index}`}
                    className="embed-responsive embed-responsive-16by9 mb-3">
                    <iframe
                      title={videoSrc}
                      className="embed-responsive-item"
                      src={videoSrc}
                    />
                  </div>
                )
              );
            })}

          <div className="bg-light p-2 small d-inline-block">
            <div>
              <Trans
                i18nKey="common:answeredBy"
                firstAnsweredBy={firstAnsweredBy}
                firstAnsweredOn={firstAnsweredOn}>
                <span className="font-weight-bold">{{ firstAnsweredBy }}</span>
                <span className="font-weight-bold">{{ firstAnsweredOn }}</span>
              </Trans>
            </div>
            {answer.lastAnsweredOn !== answer.firstAnsweredOn && (
              <div>
                <Trans
                  i18nKey="common:lastEditedBy"
                  lastAnsweredBy={lastAnsweredBy}
                  lastAnsweredOn={lastAnsweredOn}>
                  <span className="font-weight-bold">{{ lastAnsweredBy }}</span>
                  <span className="font-weight-bold">{{ lastAnsweredOn }}</span>
                </Trans>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
        <div>
          {answer.tags &&
            answer.tags.map((tag, index) => {
              return (
                <Badge
                  color="info"
                  className="mr-2 text-white"
                  key={`qna_${answer.id}_tag_${index}`}>
                  {tag}
                </Badge>
              );
            })}
        </div>
        <ButtonGroup size="sm" className="mt-2 mt-md-0">
          <TelevideoButton />
          <FlagButton
            selected={selected}
            color="red"
            basic
            title="report an issue"
            onClick={reportAnswer}
          />
          <LikeButton
            onLike={() => handleAnswerLike(question.id, answer.id)}
            likes={answer.like || 0}
          />
          <ShareButton question={question} answer={answer} />
        </ButtonGroup>
      </div>
    </div>
  );
};

AnswerItem.propTypes = {
  answer: PropTypes.object,
  youtubeLinks: PropTypes.array,
  handleReportAnswer: PropTypes.func,
  handleAnswerLike: PropTypes.func,
  question: PropTypes.object,
  selected: PropTypes.bool,
};
