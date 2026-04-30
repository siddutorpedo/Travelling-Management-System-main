import braintree from "braintree";
import Package from "../models/package.model.js";

const getBraintreeGateway = () => {
  const { BRAINTREE_MERCHANT_ID, BRAINTREE_PUBLIC_KEY, BRAINTREE_PRIVATE_KEY } = process.env;
  if (!BRAINTREE_MERCHANT_ID || !BRAINTREE_PUBLIC_KEY || !BRAINTREE_PRIVATE_KEY) {
    return null;
  }
  return new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: BRAINTREE_MERCHANT_ID,
    publicKey: BRAINTREE_PUBLIC_KEY,
    privateKey: BRAINTREE_PRIVATE_KEY,
  });
};

export const createPackage = async (req, res) => {
  try {
    const newPackage = await Package.create(req.body);
    return res.status(201).send({
      success: true,
      message: "Package created successfully",
      package: newPackage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to create package",
      error: error.message,
    });
  }
};

export const updatePackage = async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPackage) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Package updated successfully",
      package: updatedPackage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to update package",
      error: error.message,
    });
  }
};

export const deletePackage = async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Package deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to delete package",
      error: error.message,
    });
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({});
    return res.status(200).send({
      success: true,
      packages,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to load packages",
      error: error.message,
    });
  }
};

export const getPackageData = async (req, res) => {
  try {
    const singlePackage = await Package.findById(req.params.id);
    if (!singlePackage) {
      return res.status(404).send({
        success: false,
        message: "Package not found",
      });
    }
    return res.status(200).send({
      success: true,
      package: singlePackage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to load package data",
      error: error.message,
    });
  }
};

export const braintreeTokenController = async (req, res) => {
  try {
    const gateway = getBraintreeGateway();
    if (!gateway) {
      return res.status(500).send({
        success: false,
        message: "Braintree environment variables are not configured",
      });
    }

    gateway.clientToken.generate({}, (err, response) => {
      if (err) {
        console.error(err);
        return res.status(500).send({
          success: false,
          message: "Failed to generate Braintree token",
          error: err.message,
        });
      }
      return res.status(200).send({
        success: true,
        clientToken: response.clientToken,
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Failed to generate payment token",
      error: error.message,
    });
  }
};
