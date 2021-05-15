import { CardLeftPanel } from 'components/CardLeftPanel';
import { LikeButton } from 'components/LikeButton';
import React from 'react';
import { Trans } from 'react-i18next';
import { Badge, Button, ButtonGroup, Card, CardBody } from 'reactstrap';

const QuestionsCard = ({
  questions,
  appendAnswerToNote,
  displayAppendToNote = true,
}) => {
  return questions.map((question) => {
    return (
      <Card key={question.id}>
        <div>
          <CardLeftPanel title={question.title} />
        </div>
        <CardBody>
          {question.answers.map((answer) => {
            const firstAnsweredBy = answer.firstAnsweredBy
              ? answer.firstAnsweredBy.name
              : '';
            const firstAnsweredOn = new Date(answer.firstAnsweredOn * 1000)
              .toDateString()
              .substring(4);
            const lastAnsweredBy = answer.lastAnsweredBy
              ? answer.lastAnsweredBy.name
              : '';
            const lastAnsweredOn = new Date(answer.lastAnsweredOn * 1000)
              .toDateString()
              .substring(4);

            return (
              <div className="mb-2 pb-2 border-bottom" key={answer.id}>
                <div className="d-flex justify-content-between mb-3">
                  <div className="text-primary font-weight-bold mr-2">A.</div>
                  <div className="flex-grow-1">
                    <p className={answer.recommended ? 'highlighted-text' : ''}>
                      {answer.text}
                    </p>
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

                    <div className="bg-light p-2 small d-inline-block">
                      <div>
                        <Trans
                          i18nKey="common:answeredBy"
                          firstAnsweredBy={firstAnsweredBy}
                          firstAnsweredOn={firstAnsweredOn}>
                          <span className="font-weight-bold">
                            {{ firstAnsweredBy }}
                          </span>
                          <span className="font-weight-bold">
                            {{ firstAnsweredOn }}
                          </span>
                        </Trans>
                      </div>
                      {answer.lastAnsweredOn !== answer.firstAnsweredOn && (
                        <div>
                          <Trans
                            i18nKey="common:lastEditedBy"
                            lastAnsweredBy={lastAnsweredBy}
                            lastAnsweredOn={lastAnsweredOn}>
                            <span className="font-weight-bold">
                              {{ lastAnsweredBy }}
                            </span>
                            <span className="font-weight-bold">
                              {{ lastAnsweredOn }}
                            </span>
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
                    <LikeButton disabled={true} likes={answer.like || 0} />
                  </ButtonGroup>
                </div>
                {displayAppendToNote && (
                  <Button onClick={() => appendAnswerToNote(answer.text)}>
                    Append to note
                  </Button>
                )}
              </div>
            );
          })}
        </CardBody>
      </Card>
    );
  });
};

export { QuestionsCard };
