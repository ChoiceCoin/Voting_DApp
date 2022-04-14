from rest_framework import serializers
from .models import ApproveProposal,Proposal


class ProposalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proposal
        fields = '__all__'

class ApprovedProposalSerializer(serializers.ModelSerializer):
    proposal = ProposalSerializer(instance=ProposalSerializer)
    class Meta:
        model = ApproveProposal
        fields = '__all__'