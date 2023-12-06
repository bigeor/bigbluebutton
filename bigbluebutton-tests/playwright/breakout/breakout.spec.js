const { test } = require('@playwright/test');
const { Create } = require('./create');
const { Join } = require('./join');

test.describe.parallel('Breakout', () => {
  test.describe.parallel('Creating', () => {
    test('Create Breakout room @ci', async ({ browser, context, page }) => {
      const create = new Create(browser, context);
      await create.initPages(page);
      await create.create();
    });

    test('Change number of rooms', async ({ browser, context, page }) => {
      const create = new Create(browser, context);
      await create.initPages(page);
      await create.changeNumberOfRooms();
    });

    test('Change duration time', async ({ browser, context, page }) => {
      const create = new Create(browser, context);
      await create.initPages(page);
      await create.changeDurationTime();
    });

    test('Change rooms name', async ({ browser, context, page }) => {
      const create = new Create(browser, context);
      await create.initPages(page);
      await create.changeRoomsName();
    });

    test('Remove and reset assignments @ci', async ({ browser, context, page }) => {
      const create = new Create(browser, context);
      await create.initPages(page);
      await create.removeAndResetAssignments();
    });

    test('Drag and drop user in a room @ci', async ({ browser, context, page }) => {
      const create = new Create(browser, context);
      await create.initPages(page);
      await create.dragDropUserInRoom();
    });
  });

  test.describe.parallel('After creating', () => {
    // https://docs.bigbluebutton.org/2.6/release-tests.html#moderators-creating-breakout-rooms-and-assiging-users-automated
    test('Join Breakout room @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create()
      await join.joinRoom();
    });

    test('Join Breakout room and share webcam', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create()
      await join.joinAndShareWebcam();
    });

    test('Join Breakout room and share screen', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.joinAndShareScreen();
    });

    test('Join Breakout room with Audio', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.joinWithAudio();
    });

    test('Message to all rooms @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.messageToAllRooms();
    });

    test('Change duration time @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.changeDurationTime();
    });

    test('User name shows below rooms name @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.usernameShowsBelowRoomsName();
    });

    test('Show breakout room time remaining', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.showBreakoutRoomTimeRemaining();
    });

    test('End all breakout rooms @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.endAllBreakoutRooms();
    });

    test('Invite user after creating rooms @ci @flaky', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.inviteUserAfterCreatingRooms();
    });

    test('Move user to another room @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create();
      await join.moveUserToOtherRoom();
    });

    test('Export breakout room shared notes @flaky', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create(true); // capture breakout notes
      await join.exportBreakoutNotes();
    });

    test('Export breakout room whiteboard annotations @flaky', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.create(false, true); // capture breakout whiteboard
      await join.exportBreakoutWhiteboard();
    });

    test('User can choose a room @ci', async ({ browser, context, page }) => {
      const join = new Join(browser, context);
      await join.initPages(page);
      await join.createToAllowChooseOwnRoom();
      await join.userCanChooseRoom();
    });
  });
});
