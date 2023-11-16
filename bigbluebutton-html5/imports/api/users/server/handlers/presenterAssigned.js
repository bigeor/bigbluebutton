import Users from '/imports/api/users';
import PresentationPods from '/imports/api/presentation-pods';
import changePresenter from '/imports/api/users/server/modifiers/changePresenter';
import Logger from '/imports/startup/server/logger';

function setPresenterInPodReqMsg(credentials) { // TODO-- switch to meetingId, etc
  // TODO It will be removed soon
  Logger.debug(credentials);
}

export default async function handlePresenterAssigned({ body }, meetingId) {
  const { presenterId, assignedBy } = body;

  await changePresenter(true, presenterId, meetingId, assignedBy);

  const selector = {
    meetingId,
    userId: { $ne: presenterId },
    presenter: true,
  };

  const defaultPodSelector = {
    meetingId,
    podId: 'DEFAULT_PRESENTATION_POD',
  };

  const currentDefaultPod = await PresentationPods.findOneAsync(defaultPodSelector);

  const setPresenterPayload = {
    meetingId,
    requesterUserId: assignedBy,
    presenterId,
  };

  const prevPresenter = await Users.findOneAsync(selector);

  if (prevPresenter) {
    await changePresenter(false, prevPresenter.userId, meetingId, assignedBy);
  }

  /**
   * In the cases where the first moderator joins the meeting or
   * the current presenter left the meeting, akka-apps doesn't assign the new presenter
   * to the default presentation pod. This step is done manually here.
   */

  if (currentDefaultPod.currentPresenterId !== presenterId) {
    const presenterToBeAssigned = await Users.findOneAsync({ userId: presenterId });

    if (!presenterToBeAssigned) setPresenterPayload.presenterId = '';

    setPresenterInPodReqMsg(setPresenterPayload);
  }
}
