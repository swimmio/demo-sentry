from django.db.models import Q
from rest_framework.request import Request

from sentry.api.bases import OrganizationIssuesEndpoint
from sentry.models import Group, OrganizationMemberTeam, Team


class OrganizationMemberIssuesAssignedEndpoint(OrganizationIssuesEndpoint):
    def get_queryset(self, request: Request, organization, member, project_list):
        teams = Team.objects.filter(
            id__in=OrganizationMemberTeam.objects.filter(
                organizationmember=member, is_active=True
            ).values("team")
        )
        return (
            Group.objects.filter(
                Q(assignee_set__user=member.user, assignee_set__project__in=project_list)
                | Q(assignee_set__team__in=teams)
            )
            .extra(select={"sort_by": "sentry_groupasignee.date_added"})
            .order_by("-sort_by")
        )
