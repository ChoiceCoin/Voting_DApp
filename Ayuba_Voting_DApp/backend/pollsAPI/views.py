from django.shortcuts import render
from rest_framework import viewsets,permissions
from .models import Proposal,ApproveProposal
from .serializer import ApprovedProposalSerializer,ProposalSerializer

class ProposalViewSet(viewsets.ModelViewSet):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer
    #permission_classes = [permissions.IsAuthenticated]

class ApprovedProposalViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ApproveProposal.objects.all()
    serializer_class = ApprovedProposalSerializer
    #permission_classes = [permissions.IsAuthenticated]
