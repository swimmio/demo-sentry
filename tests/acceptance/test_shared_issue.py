from sentry.models import GroupShare
from sentry.testutils import AcceptanceTestCase
from sentry.testutils.helpers.datetime import before_now, iso_format
from sentry.utils.samples import load_data


class SharedIssueTest(AcceptanceTestCase):
    def setUp(self):
        super().setUp()
        self.user = self.create_user("foo@example.com")
        self.org = self.create_organization(owner=self.user, name="Rowdy Tiger")
        self.team = self.create_team(organization=self.org, name="Mariachi Band")
        self.project = self.create_project(organization=self.org, teams=[self.team], name="Bengal")
        self.login_as(self.user)

    def test_python_event(self):
        data = load_data(platform="python")
        data["timestamp"] = iso_format(before_now(days=1))
        event = self.store_event(data=data, project_id=self.project.id)

        GroupShare.objects.create(project_id=event.group.project_id, group=event.group)

        self.browser.get(f"/share/issue/{event.group.get_share_id()}/")
        self.browser.wait_until_not('[data-test-id="loading-indicator"]')
        self.browser.wait_until_test_id("event-entries-loading-false")
        self.browser.snapshot("shared issue python")
