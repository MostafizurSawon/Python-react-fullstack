# class InvoiceProductSerializer(serializers.ModelSerializer):
#     product = ProductSerializer()

#     class Meta:
#         model = InvoiceProduct
#         fields = "__all__"


# class InvoiceSerializer(serializers.ModelSerializer):
#     customer = InvoiceCustomerSerializer()
#     products = InvoiceProductSerializer(many=True)

#     class Meta:
#         model = InvoiceCustomer
#         fields = "__all__"
