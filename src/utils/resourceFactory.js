exports.createResource = (model) => async (req, res) => {
  try {
    const newResource = req.body;
    const resource = await model.create(newResource);
    res.status(201).json({
      message: "Resource created successfully",
      data: resource,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getAllResources = (model) => async (req, res) => {
  try {
    const resources = await model.find();
    if (resources.length === 0) {
      res.status(404).json({
        message: "No resources found",
      });
    } else {
      res.status(200).json({
        message: "Resources found",
        data: resources,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getResourceById = (model) => async (req, res) => {
  try {
    const id = req.params.id;
    const resource = await model.findById(id);
    if (!resource) {
      res.status(404).json({
        message: "Resource not found",
      });
    } else {
      res.status(200).json({
        message: "Resource found",
        data: resource,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteResourceById = (model) => async (req, res) => {
  try {
    const id = req.params.id;
    const deletedResource = await model.findByIdAndDelete(id);
    if (!deletedResource) {
      res.status(404).json({
        message: "Resource not found",
      });
    } else {
      res.status(200).json({
        message: "Resource deleted successfully",
        data: deletedResource,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateResourceById = (model) => async (req, res) => {
  try {
    const id = req.params.id;
    const updateResource = await model.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    });
    if (!updateResource) {
      res.status(404).json({
        message: "Resource not found",
      });
    } else {
      res.status(200).json({
        message: "Resource updated successfully",
        data: updateResource,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};

