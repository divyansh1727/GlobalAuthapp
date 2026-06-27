import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import useAuth from "@/auth/store";
import { updateUser } from "@/services/AuthService";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount } from "@/services/AuthService";
import { changePassword } from "@/services/AuthService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { uploadProfileImage } from "@/services/AuthService";
function Userprofile() {
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuth((state) => state.user);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
  const accessToken = useAuth((state) => state.accessToken);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [deletePassword, setDeletePassword] = useState("");
  const [formData, setFormData] = useState({
  name: user?.name || "",
});
const navigate = useNavigate();

const logout = useAuth((state) => state.logout);
const handleSave = async () => {
  try {
    if (!user?.id) return;

    // Update name
    let updatedUser = await updateUser(user.id, {
      ...user,
      name: formData.name,
    });
    console.log("Selected Image:", selectedImage);

    // Upload image if selected
    if (selectedImage) {
      console.log("Uploading image...");
      updatedUser = await uploadProfileImage(user.id, selectedImage);
      console.log("Upload completed");
    }
    changeLocalLoginData(
  accessToken!,
  updatedUser,
  true
);

    console.log(updatedUser);

    toast.success("Profile updated successfully!");

    setPreview(null);
    setSelectedImage(null);
    setIsEditing(false);

    // Next step:
    // Update Zustand store
  } catch (error) {
    console.error(error);
    toast.error("Failed to update profile");
  }
};
const handleChangePassword = async () => {
  try {
    if (!user?.id) return;

    await changePassword(user.id, passwordData);

    toast.success("Password changed successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (error) {
    console.error(error);
    toast.error("Failed to change password");
  }
};
const handleDeleteAccount = async () => {
  try {
    if (!user?.id) return;

    const confirmDelete = window.confirm(
      "Are you sure? This action cannot be undone."
    );

    if (!confirmDelete) return;

    await deleteAccount(user.id, deletePassword);

    toast.success("Account deleted successfully");

    logout();

    navigate("/login");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete account");
  }
};
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center"
      >
        User Profile
      </motion.h1>

      {/* Profile Card */}
      <Card className="rounded-2xl shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <Avatar className="w-28 h-28 border shadow-md">
              <AvatarImage
  src={preview || user?.image || "https://api.dicebear.com/7.x/thumbs/svg?seed=user"}
/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
           <input
  type="file"
  id="profileImage"
  accept="image/*"
  hidden
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
  }}
/>

<Button
  variant="outline"
  className="rounded-xl px-5"
  onClick={() => document.getElementById("profileImage")?.click()}
>
  Change Picture
</Button>
          </div>

          {/* User Details */}
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={user?.name}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={user?.provider}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enabled">Enabled</Label>
                <Input
                  id="enabled"
                  value={user?.enabled ? "Yes" : "No"}
                  readOnly
                  className="rounded-xl"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
  id="name"
  value={formData.name}
  onChange={(e) =>
    setFormData({
      ...formData,
      name: e.target.value,
    })
  }
  className="rounded-xl"
/>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input
                  id="provider"
                  value={user?.provider}
                  readOnly
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enabled">Enabled</Label>
                <Input
                  id="enabled"
                  value={user?.enabled ? "Yes" : "No"}
                  readOnly
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full rounded-2xl mt-4 text-lg"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
  <Button
    className="sm:flex-1 rounded-2xl"
    onClick={() => setIsEditing(false)}
  >
    Cancel
  </Button>

  <Button
    className="sm:flex-1 rounded-2xl"
    onClick={handleSave}
  >
    Save
  </Button>
</div>
          )}
        </CardContent>
      </Card>

      {/* Additional Section */}
      <Card className="rounded-2xl shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl">Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">

  <Input
    type="password"
    placeholder="Current Password"
    value={passwordData.currentPassword}
    onChange={(e) =>
      setPasswordData({
        ...passwordData,
        currentPassword: e.target.value,
      })
    }
  />

  <Input
    type="password"
    placeholder="New Password"
    value={passwordData.newPassword}
    onChange={(e) =>
      setPasswordData({
        ...passwordData,
        newPassword: e.target.value,
      })
    }
  />

  <Input
    type="password"
    placeholder="Confirm Password"
    value={passwordData.confirmPassword}
    onChange={(e) =>
      setPasswordData({
        ...passwordData,
        confirmPassword: e.target.value,
      })
    }
  />

  <Button
    variant="outline"
    className="w-full rounded-xl py-3"
    onClick={handleChangePassword}
  >
    Update Password
  </Button>

</div>
          <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      variant="destructive"
      className="w-full rounded-xl py-3 text-base"
    >
      Delete Account
    </Button>
  </AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Delete Account?
      </AlertDialogTitle>

      <AlertDialogDescription>
        This action cannot be undone.
        <br />
        Your profile, uploaded image, and account information will be permanently deleted.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Cancel
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={handleDeleteAccount}
        className="bg-red-600 hover:bg-red-700"
      >
        Delete Account
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}

export default Userprofile;