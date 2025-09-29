	import { ShipWheelIcon } from "lucide-react";
	import { useState } from "react";
	import useVerifyEmail from "../hooks/useVerifyEmail";
	const VerifyEmail = () => {

	const prefilledEmail = location.state?.email || localStorage.getItem("pendingEmail") || "";


	const [verifyData, setVerifyData] = useState({
		email: prefilledEmail,
		code: "",
	});
	console.log("Verify request data:", verifyData);
    /*
	const queryClient = useQueryClient();
	const { isPending, error, mutate:verifyMutation } = useMutation({
		mutationFn: verify,
		onSuccess: (data) => {
			queryClient.setQueryData(["authUser"], { user: data.user });
			//queryClient.invalidateQueries(["authUser"]);
			navigate("/onboarding");
		},
	});
    */
    const{isPending,error,verifyMutation}=useVerifyEmail()

	const handleVerify = (e) => {
		e.preventDefault();
		verifyMutation(verifyData);
	};

	return (
		<div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme='forest'>
		<div className='border border-primary/25 flex flex-col w-full max-w-md mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
			<div className='p-4 sm:p-8 flex flex-col'>
			{/* Logo */}
			<div className='mb-4 flex items-center justify-start gap-2'>
				<ShipWheelIcon className='size-9 text-primary' />
				<span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
				Streamify
				</span>
			</div>
			<div className='w-full'>
				<form onSubmit={handleVerify}>
				<div className='space-y-4'>
					<div>
					<h2 className='text-xl font-semibold'>Verify Your Email</h2>
					<p className='text-sm opacity-70'>
						Enter the verification code sent to <span className="font-semibold">{verifyData.email}</span>.
					</p>
					</div>
					<div className='space-y-3'>
					{/* Hidden email input, or read-only */}
					<input
						type='hidden'
						value={verifyData.email}
					/>

					<div className='form-control w-full'>
						<label className='label'>
						<span className='label-text'>Verification Code</span>
						</label>
						<input
						type='text'
						placeholder='123456'
						className='input input-bordered w-full'
						value={verifyData.code}
						onChange={(e) =>
							setVerifyData({ ...verifyData, code: e.target.value })
						}
						required
						/>
					</div>
					</div>
					{error && <p className='text-red-500 text-sm'>{error.response?.data?.message}</p>}
					<button className='btn btn-primary w-full' type='submit' disabled={isPending}>
					{isPending ? "Verifying..." : "Verify Email"}
					</button>
				</div>
				</form>
			</div>
			</div>
		</div>
		</div>
	);
	};

	export default VerifyEmail;
