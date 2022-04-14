from django.db import models
import datetime

# Create your models here.

class Proposal(models.Model):
    title = models.CharField(max_length=200)
    case = models.TextField(max_length=1000)
    option1 = models.CharField(max_length=500, default='')
    option2 = models.CharField(max_length=500, default='')
    Choice_amount = models.IntegerField(default=10)

    def __str__(self):
        return f'{self.title}'

class ApproveProposal(models.Model):
    end_date = models.DateTimeField()
    proposal = models.ForeignKey(Proposal,on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.proposal}'
