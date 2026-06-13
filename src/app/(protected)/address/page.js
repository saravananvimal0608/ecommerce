"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";
import { apiRequest } from "../../utils/commonApi";
import { showToast } from "../../utils/swal";
import {
  FiMapPin,
  FiPhone,
  FiMap,
  FiGlobe,
  FiHash,
  FiNavigation,
  FiChevronDown,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
} from "react-icons/fi";
import { FaPhoneAlt } from "react-icons/fa";
import AddressSkeleton from "@/app/utils/AddressSkeleton";

const emptyForm = {
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
  mobile: "",
};

const AddressPage = () => {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [fetching, setFetching] = useState(true);

  // "add" | "edit" | null
  const [mode, setMode] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [countries] = useState(Country.getAllCountries());
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await apiRequest("/api/address/getAddress");
      setAddresses(res.data || []);
    } catch {
      showToast({ icon: "error", title: "Failed to load addresses" });
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // country → states
  useEffect(() => {
    if (selectedCountry) {
      const s = State.getStatesOfCountry(selectedCountry.isoCode);
      setStates(s);
      setForm((p) => ({
        ...p,
        country: selectedCountry.name,
        state: "",
        city: "",
      }));
    }
  }, [selectedCountry]);

  // state → cities
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const c = City.getCitiesOfState(
        selectedCountry.isoCode,
        selectedState.isoCode,
      );
      setCities(c);
      setForm((p) => ({ ...p, state: selectedState.name, city: "" }));
    }
  }, [selectedState]);

  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setSelectedCountry(null);
    setSelectedState(null);
    setStates([]);
    setCities([]);
    setEditId(null);
    setMode("add");
  };

  const openEdit = (addr) => {
    setForm({
      address_line: addr.address_line || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "",
      mobile: addr.mobile || "",
    });
    setErrors({});
    // match country/state/city
    const country = Country.getAllCountries().find(
      (c) => c.name === addr.country,
    );
    if (country) {
      setSelectedCountry(country);
      const countryStates = State.getStatesOfCountry(country.isoCode);
      setStates(countryStates);
      const state = countryStates.find((s) => s.name === addr.state);
      if (state) {
        setSelectedState(state);
        setCities(City.getCitiesOfState(country.isoCode, state.isoCode));
      } else {
        setSelectedState(null);
        setCities([]);
      }
    } else {
      setSelectedCountry(null);
      setSelectedState(null);
      setStates([]);
      setCities([]);
    }
    setEditId(addr._id);
    setMode("edit");
  };

  const closeForm = () => {
    setMode(null);
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "mobile" || name === "pincode") && !/^\d*$/.test(value))
      return;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const err = {};
    if (!form.address_line.trim()) err.address_line = "Required";
    if (!form.country) err.country = "Required";
    if (!form.state) err.state = "Required";
    if (!form.city) err.city = "Required";
    if (!form.pincode.trim()) err.pincode = "Required";
    else if (!/^\d{6}$/.test(form.pincode)) err.pincode = "6 digits";
    if (!form.mobile.trim()) err.mobile = "Required";
    else if (!/^\d{10}$/.test(form.mobile)) err.mobile = "10 digits";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      if (mode === "edit") {
        await apiRequest(`/api/address/update/${editId}`, "put", form);
        showToast({ icon: "success", title: "Address updated!" });
      } else {
        await apiRequest("/api/address/add", "post", form);
        showToast({ icon: "success", title: "Address added!" });
      }
      closeForm();
      fetchAddresses();
    } catch (err) {
      showToast({
        icon: "error",
        title: err?.response?.data?.message || "Failed to save address",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await apiRequest(`/api/address/delete/${id}`, "delete");
      showToast({ icon: "success", title: "Address deleted" });
      fetchAddresses();
    } catch {
      showToast({ icon: "error", title: "Failed to delete address" });
    } finally {
      setDeletingId(null);
    }
  };

  if (fetching) {
    return <AddressSkeleton />;
  }
  return (
    <div className="min-h-screen common-bg px-4 py-24">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiMapPin className="text-indigo-400" /> My Addresses
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {addresses.length} saved address
              {addresses.length !== 1 ? "es" : ""}
            </p>
          </div>
          {mode !== "add" && (
            <button
              onClick={openAdd}
              className="!w-auto flex items-center gap-2 common-btn text-white text-sm font-semibold px-5 py-2.5 rounded-xl"
            >
              <FiPlus size={15} /> Add New
            </button>
          )}
        </div>

        {/* Address List */}
        {addresses.length === 0 && mode === null && (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center">
            <FiMapPin size={40} className="text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No addresses saved yet. Add your first address.
            </p>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr._id}>
            {/* Address Card */}
            {editId !== addr._id && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-white font-semibold">
                    {addr.address_line}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  <p className="text-gray-400 text-sm">{addr.country}</p>
                  <p className="text-gray-400 text-sm">
                    <FaPhoneAlt />
                    {addr.mobile}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => openEdit(addr)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-400/30 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition"
                  >
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    disabled={deletingId === addr._id}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                  >
                    <FiTrash2 size={12} />{" "}
                    {deletingId === addr._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            )}

            {/* Inline Edit Form */}
            {editId === addr._id && mode === "edit" && (
              <div className="bg-white/5 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <FiEdit2 className="text-indigo-400" /> Edit Address
                  </h3>
                  <button
                    onClick={closeForm}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <AddressForm
                  form={form}
                  errors={errors}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                  saving={saving}
                  onCancel={closeForm}
                  mode="edit"
                  countries={countries}
                  states={states}
                  cities={cities}
                  selectedCountry={selectedCountry}
                  selectedState={selectedState}
                  setSelectedCountry={setSelectedCountry}
                  setSelectedState={setSelectedState}
                  setCities={setCities}
                  setForm={setForm}
                  setErrors={setErrors}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add New Form */}
        {mode === "add" && (
          <div className="bg-white/5 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FiPlus className="text-indigo-400" /> New Address
              </h3>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white transition"
              >
                <FiX size={18} />
              </button>
            </div>
            <AddressForm
              form={form}
              errors={errors}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              saving={saving}
              onCancel={closeForm}
              mode="add"
              countries={countries}
              states={states}
              cities={cities}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              setSelectedCountry={setSelectedCountry}
              setSelectedState={setSelectedState}
              setCities={setCities}
              setForm={setForm}
              setErrors={setErrors}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable form component
const AddressForm = ({
  form,
  errors,
  handleChange,
  handleSubmit,
  saving,
  onCancel,
  mode,
  countries,
  states,
  cities,
  selectedCountry,
  selectedState,
  setSelectedCountry,
  setSelectedState,
  setCities,
  setForm,
  setErrors,
}) => {
  const inputClass = (f) =>
    `w-full pl-10 pr-4 py-3 bg-black/20 text-white rounded-xl border placeholder-gray-500 outline-none focus:ring-2 transition-all text-sm ${errors[f] ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-indigo-500"}`;
  const selectClass = (f) =>
    `w-full pl-10 pr-8 py-3 bg-black/20 text-white rounded-xl border outline-none focus:ring-2 transition-all text-sm appearance-none ${errors[f] ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-indigo-500"}`;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      {/* Address Line */}
      <div className="col-span-2 flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">
          Address Line
        </label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="address_line"
            value={form.address_line}
            onChange={handleChange}
            placeholder="House no, Street, Area"
            className={inputClass("address_line")}
          />
        </div>
        {errors.address_line && (
          <span className="text-red-400 text-xs">{errors.address_line}</span>
        )}
      </div>

      {/* Country */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">Country</label>
        <div className="relative">
          <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
          <select
            className={selectClass("country")}
            value={selectedCountry?.isoCode || ""}
            onChange={(e) => {
              const c = countries.find((c) => c.isoCode === e.target.value);
              setSelectedCountry(c || null);
              setSelectedState(null);
              setCities([]);
              setForm((p) => ({ ...p, state: "", city: "" }));
              setErrors((er) => ({ ...er, country: "" }));
            }}
          >
            <option value="" disabled className="bg-gray-900">
              Select country
            </option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode} className="bg-gray-900">
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {errors.country && (
          <span className="text-red-400 text-xs">{errors.country}</span>
        )}
      </div>

      {/* State */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">State</label>
        <div className="relative">
          <FiMap className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
          <select
            className={selectClass("state")}
            value={selectedState?.isoCode || ""}
            disabled={!selectedCountry}
            onChange={(e) => {
              const s = states.find((s) => s.isoCode === e.target.value);
              setSelectedState(s || null);
              setForm((p) => ({ ...p, city: "" }));
              setErrors((er) => ({ ...er, state: "" }));
            }}
          >
            <option value="" disabled className="bg-gray-900">
              {selectedCountry ? "Select state" : "Select country first"}
            </option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode} className="bg-gray-900">
                {s.name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {errors.state && (
          <span className="text-red-400 text-xs">{errors.state}</span>
        )}
      </div>

      {/* City */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">City</label>
        <div className="relative">
          <FiNavigation className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
          <select
            className={selectClass("city")}
            value={form.city}
            disabled={!selectedState}
            onChange={(e) => {
              setForm((p) => ({ ...p, city: e.target.value }));
              setErrors((er) => ({ ...er, city: "" }));
            }}
          >
            <option value="" disabled className="bg-gray-900">
              {selectedState
                ? cities.length
                  ? "Select city"
                  : "No cities"
                : "Select state first"}
            </option>
            {cities.map((c) => (
              <option key={c.name} value={c.name} className="bg-gray-900">
                {c.name}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {errors.city && (
          <span className="text-red-400 text-xs">{errors.city}</span>
        )}
      </div>

      {/* Pincode */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">Pincode</label>
        <div className="relative">
          <FiHash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
            maxLength={6}
            className={inputClass("pincode")}
          />
        </div>
        {errors.pincode && (
          <span className="text-red-400 text-xs">{errors.pincode}</span>
        )}
      </div>

      {/* Mobile */}
      <div className="col-span-2 flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-300">
          Mobile Number
        </label>
        <div className="relative">
          <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            maxLength={10}
            className={inputClass("mobile")}
          />
        </div>
        {errors.mobile && (
          <span className="text-red-400 text-xs">{errors.mobile}</span>
        )}
      </div>

      {/* Buttons */}
      <div className="col-span-2 flex gap-3 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition flex items-center justify-center gap-2"
        >
          <FiX size={14} /> Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl common-btn text-white text-sm font-semibold disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          <FiSave size={14} />{" "}
          {saving
            ? "Saving..."
            : mode === "edit"
              ? "Update Address"
              : "Save Address"}
        </button>
      </div>
    </form>
  );
};

export default AddressPage;
